import { LexoRank } from "@dalet-oss/lexorank";

export function lexoRankBetween(
    prevRank: string | null | undefined,
    nextRank: string | null | undefined,
): string {
    if (prevRank && nextRank) {
        const prev = LexoRank.parse(prevRank);
        const next = LexoRank.parse(nextRank);
        return prev.between(next).toString();
    }

    if (prevRank && !nextRank) {
        return LexoRank.parse(prevRank).genNext().toString();
    }

    if (!prevRank && nextRank) {
        return LexoRank.parse(nextRank).genPrev().toString();
    }

    return LexoRank.middle().toString();
}

export function lexoRankFirst(
    firstRank: string | null | undefined,
): string {
    if (firstRank) {
        return LexoRank.parse(firstRank).genPrev().toString();
    }
    return LexoRank.middle().toString();
}

export function lexoRankLast(
    lastRank: string | null | undefined,
): string {
    if (lastRank) {
        return LexoRank.parse(lastRank).genNext().toString();
    }
    return LexoRank.middle().toString();
}

/**
 * Generate N unique lexoranks that all sort AFTER `lastRank`.
 * If `lastRank` is null (empty column), generates N ranks starting from middle.
 * Uses genNext() which is safe at all boundaries and never collides with existing ranks.
 *
 * @param count        Number of ranks to generate
 * @param lastRank     The current highest lexorank in the target column (or null if empty)
 * @param existingSet  Optional set of all existing ranks in the column for collision check
 */
export function generateBulkLexoranks(
    count: number,
    lastRank: string | null | undefined,
    existingSet?: Set<string>,
): string[] {
    if (count === 0) return [];

    const ranks: string[] = [];
    let cursor: LexoRank;

    if (lastRank) {
        cursor = LexoRank.parse(lastRank).genNext();
    } else {
        cursor = LexoRank.middle();
    }

    for (let i = 0; i < count; i++) {
        let rank = cursor.toString();

        // Skip any rank that already exists in the column
        if (existingSet) {
            while (existingSet.has(rank)) {
                cursor = cursor.genNext();
                rank = cursor.toString();
            }
        }

        ranks.push(rank);
        cursor = cursor.genNext();
    }

    return ranks;
}
