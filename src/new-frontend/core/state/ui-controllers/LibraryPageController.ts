import { autorun, makeAutoObservable, observable, toJS } from 'mobx'
import { Box } from '../common/utils'
import { Category } from 'new-frontend/types'
import LibraryListControler from './LibraryListController'
import LibraryPagination, {
    LibraryPaginationOptions
} from '../fetch-data/LibraryPagination'
import { GlobalStore } from '../global/GlobalStore'
import { get, merge, pick, set } from 'lodash'
import { debounce } from '@mui/material'
import { SortGame } from '../common/common'

const STORAGE_KEY = 'data.library-page'

export default class LibraryPageController {
    readonly search = Box.create('')

    readonly category = Box.create<Category>('all')
    readonly platform = Box.create('all')

    mode = Box.create<'recents' | 'favorites' | 'all'>('recents')

    enabled = observable({
        favorites: false,
        recents: false,
        runners: {
            legendary: false,
            gog: false
        },
        notInstalled: false,
        platforms: {
            windows: false,
            linux: false
        }
    })

    listScrollPosition = { left: 0, top: 0 }
    listDimensions: { height: number; width: number } = { height: 0, width: 0 }
    previousListScrollPosition = { ...this.listScrollPosition }
    readonly pagination: LibraryPagination

    readonly sort = Box.create<SortGame>('installed')
    readonly layout = Box.create<'grid' | 'list'>('grid')
    readonly showHidden = Box.create(false)

    constructor(private globalStore: GlobalStore) {
        this.pagination = new LibraryPagination({
            ...this.paginationOptions,
            sortBox: this.sort,
            showHiddenBox: this.showHidden,
            rpp: 20,
            enabled: this.enabled,
            globalStore: globalStore,
            modeBox: this.mode
        })
        this.loadSaved()
        makeAutoObservable(this)

        autorun(() => {
            const serializeListController = (
                controller: LibraryListControler
            ) => {
                return toJS(pick(controller, ['sort', 'layout', 'showHidden']))
            }
            console.log('Saving LibraryPageController data')
            // localStorage.setItem(
            //     STORAGE_KEY,
            //     JSON.stringify({
            //         mainLibrary: serializeListController(this.mainLibrary)
            //     })
            // )
        })
    }

    setListScrollPosition = debounce(
        (scrollPosition: { top: number; left: number }) => {
            this.previousListScrollPosition = { ...this.listScrollPosition }
            this.listScrollPosition = { ...scrollPosition }
        },
        300
    )

    setListDimensions = debounce(
        (listDimensions: { width: number; height: number }) => {
            this.listDimensions = { ...listDimensions }
        },
        300
    )

    get isListScrollingToTop() {
        if (!this.listScrollPosition?.top && !this.listScrollPosition?.left) {
            return false
        }
        return (
            this.listScrollPosition?.top < this.previousListScrollPosition?.top
        )
    }

    loadSaved() {
        const savedData = localStorage.getItem(STORAGE_KEY)
        if (savedData) {
            merge(this, JSON.parse(savedData))
        }
    }

    private get paginationOptions(): Partial<LibraryPaginationOptions> {
        return {
            termBox: this.search,
            categoryBox: this.category
        }
    }

    toggleEnabled(path: string) {
        set(this.enabled, path, !get(this.enabled, path))
    }
}
