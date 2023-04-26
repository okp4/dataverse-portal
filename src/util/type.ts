export type ForgetType<This, That> = Pick<That, Exclude<keyof That, keyof This>>
