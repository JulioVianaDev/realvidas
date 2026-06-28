export interface Paginate<T> {
    data: T[];
    metadata: {
        page: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        lastPage: number;
        total: number;
    };
}
