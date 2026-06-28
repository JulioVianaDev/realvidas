import {
    lexoRankBetween,
    lexoRankFirst,
    lexoRankLast,
} from "@global-types/helpers/lexorank";

interface Rankable {
    rank: string;
}

export function sortByRank<T extends Rankable>(items: T[]): T[] {
    return [...items].sort((a, b) => a.rank.localeCompare(b.rank));
}

export function generateRankBefore(firstRank: string): string {
    return lexoRankFirst(firstRank);
}

export function generateRankBetween(
    prevRank: string,
    nextRank: string,
): string {
    return lexoRankBetween(prevRank, nextRank);
}

export function generateRankAtEnd<T extends Rankable>(items: T[]): string {
    const sorted = sortByRank(items);
    const lastRank = sorted.length > 0 ? sorted[sorted.length - 1].rank : null;
    return lexoRankLast(lastRank);
}

export function generateRankBeforeFinish<
    T extends Rankable & { isFinish?: boolean },
>(items: T[]): string {
    const sorted = sortByRank(items);
    const finishIdx = sorted.findIndex((item) => item.isFinish);
    if (finishIdx === -1) {
        return generateRankAtEnd(sorted);
    }

    const finishCol = sorted[finishIdx];
    const prevCol = finishIdx > 0 ? sorted[finishIdx - 1] : null;
    if (prevCol) {
        return generateRankBetween(prevCol.rank, finishCol.rank);
    }
    return generateRankBefore(finishCol.rank);
}
