export type Exact<T extends Base, Base> = Base extends Base
    ? {} extends Omit<T, keyof Base>
        ? T
        : Record<
              // @ts-ignore
              __internal__,
              `Following key is redundant: ${keyof Omit<
                  T,
                  keyof Base
              > &
                  string}`
          >
    : never;
