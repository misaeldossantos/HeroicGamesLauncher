import { GameInfo } from '../../../../common/types'
import { StateBox } from '../common/utils'
import { autorun, makeAutoObservable, runInAction } from 'mobx'
import { SortGame } from '../common/common'
import { GlobalStore } from '../global/GlobalStore'
import { debounce } from 'lodash'
import { Category } from '../../../types'

function fixFilter(text: string) {
    const regex = new RegExp(/([?\\|*|+|(|)|[|]|])+/, 'g')
    return text.replaceAll(regex, '')
}

const enabled = {
    favorites: false,
    recents: false,
    runners: {
        legendary: false,
        gog: false
    },
    platforms: {
        windows: false,
        linux: false
    },
    notInstalled: false
}

const filterByPlatform = ({
    category,
    platform,
    game,
    currentPlatform
}: {
    category?: Category
    platform?: string
    game: GameInfo
    currentPlatform?: string
}) => {
    // Epic doesn't offer Linux games, so just default to showing all games there
    if (category === 'legendary' && platform === 'linux') {
        return true
    }

    const isMac = ['osx', 'Mac']

    switch (platform) {
        case 'win':
            return game?.is_installed
                ? game?.install?.platform?.toLowerCase() === 'windows'
                : currentPlatform === 'darwin'
                ? !game?.is_mac_native
                : !game?.is_linux_native
        case 'mac':
            return game?.is_installed
                ? isMac.includes(game?.install?.platform ?? '')
                : game?.is_mac_native
        case 'linux':
            return game?.is_installed
                ? game?.install?.platform === 'linux'
                : game?.is_linux_native
        default:
            return true
    }
}

export type LibraryPaginationOptions = {
    globalStore: GlobalStore
    termBox?: StateBox<string>
    sortBox?: StateBox<SortGame>
    platformBox?: StateBox<string>
    categoryBox?: StateBox<Category>
    showHiddenBox?: StateBox<boolean>
    onlyFavourites?: boolean
    onlyRecent?: boolean
    enabled: typeof enabled
    modeBox: StateBox<'recents' | 'favorites' | 'all'>
    rpp: number
}

export default class LibraryPagination {
    page = 1

    refreshing = false

    allResults = []

    constructor(private options: LibraryPaginationOptions) {
        makeAutoObservable(this)
        this.init()
    }

    init() {
        const setAllResults = debounce((val) => {
            runInAction(() => {
                this.allResults = val
            })
        }, 300)
        setTimeout(() => {
            autorun(() => setAllResults(this.getResults()))
        }, 300)
    }

    private get globalStore() {
        return this.options.globalStore
    }

    get sortDescending() {
        if (!this.options.sortBox) return false
        return this.options.sortBox.is('descending')
    }

    get sortInstalled() {
        if (!this.options.sortBox) return false
        return this.options.sortBox.is('installed')
    }

    get list() {
        return this.allResults.slice(0, this.page * this.options.rpp + 1)
    }

    get totalCount() {
        return this.allResults.length
    }

    get enabled() {
        return this.options.enabled
    }

    getResults() {
        const regex = new RegExp(fixFilter(this.term || ''), 'i')
        const filtered = this.options.globalStore.libraryGames.filter((i) => {
            if (
                this.options.categoryBox &&
                !this.options.categoryBox.is('all') &&
                !this.options.categoryBox.is(i.data.runner)
            ) {
                return false
            }
            if (this.options.modeBox.is('recents') && !i.isRecent) {
                return false
            }
            if (this.options.modeBox.is('favorites') && !i.isFavourite) {
                return false
            }
            if (!this.enabled.notInstalled && !i.isInstalled) {
                return false
            }
            if (!this.enabled.runners[i.data.runner]) {
                return false
            }
            if (!this.options.showHiddenBox?.get() && i.isHidden) {
                return false
            }
            if (
                this.options.platformBox?.get() &&
                !filterByPlatform({
                    platform: this.options.platformBox.get(),
                    game: i.data,
                    category: this.options.categoryBox?.get(),
                    currentPlatform: this.globalStore.platform
                })
            ) {
                return false
            }
            return regex.test(i.data.title)
        })

        // sort
        const library = filtered.sort((a, b) => {
            const gameA = a.data.title.toUpperCase().replace('THE ', '')
            const gameB = b.data.title.toUpperCase().replace('THE ', '')
            return this.sortDescending
                ? gameA > gameB
                    ? -1
                    : 1
                : gameA < gameB
                ? -1
                : 1
        })
        const installed = filtered.filter((g) => g.isInstalled)
        const notInstalled = filtered.filter(
            (g) => !g.isInstalled && !g.isInstalling
        )
        const installingGames = library.filter(
            (g) => !g.isInstalled && g.isInstalling
        )

        return this.sortInstalled
            ? [...installingGames, ...installed, ...notInstalled]
            : library
    }

    get hasMore() {
        return this.globalStore.libraryGames.length !== this.list.length
    }

    get term() {
        return this.options.termBox ? this.options.termBox.get() : ''
    }

    async refresh() {
        this.refreshing = true
        setTimeout(() => {
            runInAction(() => {
                this.refreshing = false
            })
        }, 1000)
    }

    loadMore() {
        if (this.hasMore) {
            this.page++
        }
    }
}
