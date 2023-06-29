export type ForgetType<This, That> = Pick<That, Exclude<keyof That, keyof This>>
export type AssertSubset<T, U extends T> = U
export type NonEmptyArray<T> = [T, ...T[]]
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
