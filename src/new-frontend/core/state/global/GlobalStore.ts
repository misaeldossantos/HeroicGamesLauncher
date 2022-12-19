import { GameIdentifier, GameInfo, WineInstallation } from 'common/types'
import { makeAutoObservable, runInAction } from 'mobx'
import { Game } from '../model/Game'
import { GameDownloadQueue } from '../managers/GameDownloadQueue'
import { configStore } from '../../helpers/electronStores'
import LibraryPageController from '../ui-controllers/LibraryPageController'
import { find } from 'lodash'
import LayoutPreferences from '../settings/LayoutPreferences'
import MainPageController from '../ui-controllers/MainPageController'
import { bridgeStore } from './index'
import AppSettings from '../settings/AppSettings'
import EpicGameStore from '../game-stores/EpicGameStore'
import GOGGameStore from '../game-stores/GOGGameStore'
import { Disclosure } from '../common/utils'

export class GlobalStore {
    platform = 'linux'
    gameDownloadQueue = new GameDownloadQueue(this)
    mainPage = new MainPageController()
    layoutPreferences = new LayoutPreferences()
    libraryController = new LibraryPageController(this)
    private favouriteStoredGames: GameIdentifier[] = []
    private hiddenStoredGames: GameIdentifier[] = []
    refreshingLibrary = false

    settings = new AppSettings()

    wineVersions: WineInstallation[] = []

    epicLibrary: GameInfo[] = []
    gogLibrary: GameInfo[] = []
    sideLoadLibrary: GameInfo[] = []

    stores = {
        epic: new EpicGameStore(),
        gog: new GOGGameStore()
    }

    confirmationModal = new Disclosure<{ message: string }, boolean>()

    constructor() {
        makeAutoObservable(this)
        this.refresh()
        //
        // const syncStoredGameInfoById = (key: string, propertyFrom: string) => {
        //     autorun(() => {
        //         // when favouriteGames changed, automatically save to configStore
        //         configStore.set(
        //             key,
        //             this[propertyFrom].map((game: Game) => ({
        //                 appName: game.appName,
        //                 title: game.data.title
        //             }))
        //         )
        //     })
        // }

        window.api.getAlternativeWine().then((val) => {
            runInAction(() => {
                this.wineVersions = val
            })
        })

        // syncStoredGameInfoById('games.favourites', 'favouriteGames')
        // syncStoredGameInfoById('games.hidden', 'hiddenGames')
    }

    requestNewSideLoadGame() {
        // this.requestInstallModal.show({ runner: 'sideload' })
    }

    getGame(name: string): Game {
        return this.gameInstancesByAppName[name]
    }

    get isLinux() {
        return this.platform === 'linux'
    }

    async refresh({
        checkForUpdates = false
    }: { checkForUpdates?: boolean } = {}) {
        this.refreshingLibrary = true
        this.favouriteStoredGames = configStore.get(
            'games.favourites',
            []
        ) as GameIdentifier[]
        this.hiddenStoredGames = configStore.get(
            'games.hidden',
            []
        ) as GameIdentifier[]

        for (const store of Object.values(this.stores)) {
            await store.loadGames()
        }

        // this.sideLoadLibrary = sideloadLibrary.get('games', []) as GameInfo[]
        if (checkForUpdates) {
            await bridgeStore.loadUpdatedGamesAppNames()
        }
        await bridgeStore.loadRecentGamesAppNames()

        for (const game of this.libraryGames) {
            game.isFavourite = !!find(this.favouriteStoredGames, {
                appName: game.appName
            })
            game.isHidden = !!find(this.hiddenStoredGames, {
                appName: game.appName
            })
        }
        this.refreshingLibrary = false
    }

    // library with GameInfo
    get library() {
        return [
            ...this.epicLibrary,
            ...this.gogLibrary,
            ...this.sideLoadLibrary
        ]
    }

    get gameInstancesByAppName() {
        return this.libraryGames.reduce((acc, game) => {
            acc[game.appName] = game
            return acc
        }, {})
    }

    // library with Game instances
    get libraryGames() {
        return Object.values(this.stores)
            .map((store) => [...store.games])
            .flat(1)
    }

    get favouriteGames() {
        return this.libraryGames.filter((game) => game.isFavourite)
    }

    get hiddenGames() {
        return this.libraryGames.filter((game) => game.isHidden)
    }

    get systemDependsOnWine() {
        return this.platform !== 'windows'
    }
}
