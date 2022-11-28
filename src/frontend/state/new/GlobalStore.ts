import { TFunction } from 'react-i18next'
import { GameIdentifier, GameInfo } from 'common/types'
import { autorun, makeAutoObservable } from 'mobx'
import { GameInstallationSettings } from './common'
import { Game } from './Game'
import { GameDownloadQueue } from './GameDownloadQueue'
import { configStore, libraryStore } from 'frontend/helpers/electronStores'
import LibraryPageController from './LibraryPageController'
import { find } from 'lodash'

class LayoutPreferences {
  themeName = 'heroic'
  zoomPercent = 100
  primaryFontFamily = ''
  secondaryFontFamily = ''
}

type RequestInstallOptions = {
  game: Game
  defaultValues?: Partial<GameInstallationSettings>
  onSend: (data: GameInstallationSettings) => void
}

class RequestInstallModalController {
  options?: RequestInstallOptions
  opened = false

  constructor() {
    makeAutoObservable(this)
  }

  show(options: RequestInstallOptions) {
    this.options = options
    this.opened = true
  }

  send(request: Omit<GameInstallationSettings, 'game'>) {
    if (this.options) {
      this.options.onSend({ ...request, game: this.options.game })
      this.options = undefined
      this.opened = false
    }
  }

  cancelRequest() {
    this.options = undefined
    this.opened = false
  }
}

export class GlobalStore {
  language = 'en'
  platform = 'linux'
  gameDownloadQueue = new GameDownloadQueue(this)
  layoutPreferences = new LayoutPreferences()
  requestInstallModal = new RequestInstallModalController()
  i18n?: TFunction<'gamepage'>
  libraryController = new LibraryPageController(this)
  private gameInstancesByAppName: { [key: string]: Game } = {}
  private favouriteStoredGames: GameIdentifier[] = []
  private hiddenStoredGames: GameIdentifier[] = []

  epicLibrary: GameInfo[] = []

  constructor() {
    makeAutoObservable(this)
    this.refresh()

    const syncStoredGameInfoById = (key: string, propertyFrom: string) => {
      autorun(() => {
        // when favouriteGames changed, automatically save to configStore
        console.log(`Syncing ${key}`)
        configStore.set(
          key,
          this[propertyFrom].map((game: Game) => ({
            appName: game.appName,
            title: game.data.title
          }))
        )
      })
    }

    syncStoredGameInfoById('games.favourites', 'favouriteGames')
    syncStoredGameInfoById('games.hidden', 'hiddenGames')
  }

  getGame(name: string): Game {
    return this.gameInstancesByAppName[name]
  }

  get isLinux() {
    return this.platform === 'linux'
  }

  refresh() {
    this.favouriteStoredGames = configStore.get(
      'games.favourites',
      []
    ) as GameIdentifier[]
    this.hiddenStoredGames = configStore.get(
      'games.hidden',
      []
    ) as GameIdentifier[]

    this.epicLibrary = libraryStore.get('library', []) as GameInfo[]
    for (const gameInfo of this.epicLibrary) {
      const game = new Game(gameInfo)
      game.isFavourite = !!find(this.favouriteStoredGames, {
        appName: game.appName
      })
      game.isHidden = !!find(this.hiddenStoredGames, {
        appName: game.appName
      })
      this.gameInstancesByAppName[gameInfo.app_name] = game
    }
  }

  get libraryGames() {
    return Object.values(this.gameInstancesByAppName)
  }

  get favouriteGames() {
    return this.libraryGames.filter((game) => game.isFavourite)
  }

  get hiddenGames() {
    return this.libraryGames.filter((game) => game.isHidden)
  }
}
