import type { WalletPort, WalletPortDeps } from "./port"

export type Deps = WalletPortDeps & {
    walletPorts: WalletPort[]
}
  