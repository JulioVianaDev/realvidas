import { IAdminAnalyticsMessageCostUsd } from "../body-requests/admin-analytics.body-request";
import { IAdminAnalyticsMessageUsage } from "../entities/admin-analytics.entity-type";

/**
 * Per-AI-model pricing. Express prices as USD per 1 million tokens — the
 * native unit AI providers publish (e.g. OpenAI: "$0.20 per 1M input
 * tokens"). This is the only pricing unit this helper understands.
 */
export interface IAdminAnalyticsModelPricingUsdPerMTokens {
    /** USD per 1_000_000 input tokens. */
    inputPerMTokens: number;
    /** USD per 1_000_000 cached-input tokens. */
    cachedInputPerMTokens: number;
    /** USD per 1_000_000 output tokens. */
    outputPerMTokens: number;
}

/**
 * Compute message cost from raw token usage + per-model pricing without any
 * floating-point accumulation.
 *
 * Why this exists:
 *   The ingest pipeline stores cost as integer nanodollars (exact). The
 *   upstream multiplication `tokens × pricePerMillion` is the *only* step
 *   where FP drift can still creep in (e.g. `397 * 0.00012 / 1e6` in plain
 *   JS math may leave a 1e-17 residue). This helper does that step in
 *   BigInt picodollar space, then snaps to nanos, so any drift is gone
 *   *before* the value is even serialised into the body-request.
 *
 * Precision budget:
 *   - internal representation: picodollars (1 USD = 1e12 picos)
 *   - final output: USD floats, already quantised to 1-nanodollar grid
 *   - smallest resolvable cost: $1e-9 (one nanodollar)
 *   - BigInt multiply handles any (tokens × price) product without overflow,
 *     so you can price a 1M-token message at $1000/M without loss.
 *
 * Worked example (the numbers in your question):
 *   usage  = { promptTokens: 397, completionTokens: 65, cachedTokens: 0 }
 *   prices = { inputPerMTokens: 0.05, outputPerMTokens: 0.4, cachedInputPerMTokens: 0 }
 *     → input  = 397 × 0.05  × 1000 nanos/token_per_M = 19_850 nanos = $0.00001985
 *     → output = 65  × 0.4   × 1000 nanos/token_per_M = 26_000 nanos = $0.00002600
 *     → total  = 45_850 nanos = $0.00004585
 *   Matches your tool-call cost exactly.
 */
export function calculateMessageCostUsd(
    usage: IAdminAnalyticsMessageUsage,
    pricing: IAdminAnalyticsModelPricingUsdPerMTokens,
    sellUsd: number = 0,
): IAdminAnalyticsMessageCostUsd {
    const PICOS_PER_USD = 1_000_000_000_000; // 1e12
    const PICOS_PER_NANO_TIMES_M_TOKENS = 1_000_000_000n; // 1e9 — divide picos × tokens by this to land on nanos

    const toPicosPerMTokens = (usdPerMTokens: number): bigint =>
        BigInt(Math.round(usdPerMTokens * PICOS_PER_USD));

    /**
     * Given tokens and picosPerMTokens, compute cost in integer nanodollars.
     * Math identity:
     *   cost_nanos = (tokens × picosPerMTokens) / 1_000_000_000
     *   because 1 nano = 1000 picos and picosPerMTokens ÷ 1e6 = picos/token.
     * Using BigInt so `tokens × picosPerMTokens` never overflows.
     */
    const costNanos = (tokens: number, picosPerMTokens: bigint): number => {
        if (tokens === 0 || picosPerMTokens === 0n) return 0;
        const product = BigInt(tokens) * picosPerMTokens;
        const quotient = product / PICOS_PER_NANO_TIMES_M_TOKENS;
        const remainder = product % PICOS_PER_NANO_TIMES_M_TOKENS;
        // Round half up.
        const halfDivisor = PICOS_PER_NANO_TIMES_M_TOKENS / 2n;
        const rounded =
            remainder >= halfDivisor ? quotient + 1n : quotient;
        return Number(rounded);
    };

    const inputPicosPerM = toPicosPerMTokens(pricing.inputPerMTokens);
    const cachedPicosPerM = toPicosPerMTokens(
        pricing.cachedInputPerMTokens,
    );
    const outputPicosPerM = toPicosPerMTokens(pricing.outputPerMTokens);

    const inputNanos = costNanos(usage.promptTokens, inputPicosPerM);
    const cachedNanos = costNanos(usage.cachedTokens, cachedPicosPerM);
    const outputNanos = costNanos(usage.completionTokens, outputPicosPerM);
    const totalNanos = inputNanos + cachedNanos + outputNanos;

    // Quantised USD (safe to pass through `Math.round(usd * 1e9)` at ingest).
    const nanosToUsd = (nanos: number): number =>
        nanos / 1_000_000_000;

    return {
        inputCostUsd: nanosToUsd(inputNanos),
        cachedInputCostUsd: nanosToUsd(cachedNanos),
        outputCostUsd: nanosToUsd(outputNanos),
        totalCostUsd: nanosToUsd(totalNanos),
        sellUsd,
    };
}
