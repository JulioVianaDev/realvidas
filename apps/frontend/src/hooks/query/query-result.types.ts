import type {
    InfiniteData,
    UseInfiniteQueryResult,
    UseMutationResult,
    UseQueryResult,
} from "@tanstack/react-query";

export type QueryResult<TData> = UseQueryResult<TData, Error>;

export type InfiniteQueryResult<
    TPageData,
    TPageParam = unknown,
> = UseInfiniteQueryResult<
    InfiniteData<TPageData, TPageParam>,
    Error
>;

export type MutationResult<TData, TVariables = void> = UseMutationResult<
    TData,
    Error,
    TVariables
>;
