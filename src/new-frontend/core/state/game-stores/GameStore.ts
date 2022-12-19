import { Game } from '../model/Game'

export type GameStoreUser = {
    name: string
    username: string
}

export default interface GameStore {
    auth(authCode: string): Promise<void>
    logout(): Promise<void>
    loadGames(): Promise<void>
    refreshLibrary(fullRefresh: boolean): Promise<void>
    get name(): string
    get refreshing(): boolean
    get games(): Game[]
    get logoImage(): string
    get displayName(): string
    get isLogged(): boolean
    get user(): GameStoreUser | undefined
    get installedGames(): Game[]
}
