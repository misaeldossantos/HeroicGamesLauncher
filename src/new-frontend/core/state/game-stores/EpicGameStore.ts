import GameStore, { GameStoreUser } from './GameStore'
import { makeAutoObservable } from 'mobx'
import { configStore } from '../../../../frontend/helpers/electronStores'
import { GameInfo, UserInfo } from '../../../../common/types'
import epicLogo from '../../../assets/epic-white.png'
import { Game } from '../model/Game'
import { libraryStore } from '../../helpers/electronStores'

export default class EpicGameStore implements GameStore {
    private _user?: GameStoreUser
    private _games: Game[] = []
    private _refreshing = false

    constructor() {
        makeAutoObservable(this)
        this.loadUserData()
    }

    private loadUserData() {
        const userInfo = configStore.get('userInfo', null) as UserInfo
        if (userInfo) {
            this._user = {
                name: userInfo.user,
                username: userInfo.displayName
            }
        } else {
            this._user = undefined
        }
    }

    async auth(sid: string) {
        const response = await window.api.login(sid)

        if (response.status === 'done') {
            this.loadUserData()
            await this.refreshLibrary(true)
        }
    }

    async logout() {
        await window.api.logoutLegendary()
        console.log('Logging out from epic')
        this.loadUserData()
        await this.refreshLibrary(true)
    }

    async refreshLibrary(fullRefresh: boolean) {
        this._refreshing = true
        await window.api.refreshLibrary(fullRefresh, 'legendary')
        await this.loadGames()
        this._refreshing = false
    }

    async loadGames() {
        const library = libraryStore.get('library', []) as GameInfo[]
        this._games = []
        for (const gameInfo of library) {
            this._games.push(new Game(gameInfo))
        }
    }

    get name(): string {
        return 'epic-games'
    }

    get user(): GameStoreUser | undefined {
        return this._user
    }

    get isLogged(): boolean {
        return !!this.user
    }

    get displayName(): string {
        return 'Epic Games'
    }

    get logoImage(): string {
        return epicLogo
    }

    get games(): Game[] {
        return this._games
    }

    get refreshing(): boolean {
        return this._refreshing
    }

    get installedGames(): Game[] {
        return this.games.filter((game) => game.isInstalled)
    }
}
