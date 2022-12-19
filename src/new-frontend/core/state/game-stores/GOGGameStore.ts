import GameStore, { GameStoreUser } from './GameStore'
import { makeAutoObservable } from 'mobx'
import { gogConfigStore } from '../../../../frontend/helpers/electronStores'
import gogLogo from 'new-frontend/assets/gog-logo.svg'
import { Game } from '../model/Game'
import { loadGOGLibrary } from '../../helpers'

export default class GOGGameStore implements GameStore {
    private readonly _user?: GameStoreUser
    private _games: Game[] = []

    constructor() {
        makeAutoObservable(this)
        const userData = gogConfigStore.get('userData', null)
        if (userData) {
            this._user = {
                username: userData['username'],
                name: userData['username']
            }
        }
    }

    async auth(token: string) {
        const response = await window.api.authGOG(token)

        if (response.status === 'done') {
            await this.refreshLibrary(true)
            await this.loadGames()
        }
    }

    async logout() {
        await window.api.logoutGOG()
        console.log('Logging out from gog')
        window.location.reload()
    }

    get name(): string {
        return 'gog-games'
    }

    get displayName(): string {
        return 'GOG.com'
    }

    get isLogged(): boolean {
        return !!this._user
    }

    get logoImage(): string {
        return gogLogo
    }

    get user(): GameStoreUser | undefined {
        return this._user
    }

    get games(): Game[] {
        return this._games
    }

    async loadGames() {
        const library = loadGOGLibrary()
        for (const gameInfo of library) {
            this.games.push(new Game(gameInfo))
        }
    }

    async refreshLibrary(fullRefresh: boolean) {
        await window.api.refreshLibrary(fullRefresh, 'gog')
    }
}
