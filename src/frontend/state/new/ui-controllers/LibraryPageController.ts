import { autorun, makeAutoObservable, toJS } from 'mobx'
import { Box } from '../common/utils'
import { Category } from '../../../types'
import LibraryListControler from './LibraryListController'
import { LibraryPaginationOptions } from '../fetch-data/LibraryPagination'
import { GlobalStore } from '../global/GlobalStore'
import { merge, pick } from 'lodash'
import { debounce } from '@mui/material'

const STORAGE_KEY = 'data.library-page'

export default class LibraryPageController {
  readonly search = Box.create('')
  readonly listNameVisible = Box.create<'recent' | 'favourite' | 'all'>(
    'recent'
  )
  readonly category = Box.create<Category>('all')
  readonly platform = Box.create('all')
  readonly mainLibrary: LibraryListControler
  readonly recentGames: LibraryListControler
  readonly favouritesLibrary: LibraryListControler

  listScrollPosition = { left: 0, top: 0 }
  listDimensions: { height: number; width: number } = { height: 0, width: 0 }
  previousListScrollPosition = { ...this.listScrollPosition }

  constructor(private globalStore: GlobalStore) {
    this.mainLibrary = new LibraryListControler(
      this.paginationOptions,
      globalStore
    )
    this.recentGames = new LibraryListControler(
      {
        ...this.paginationOptions,
        onlyRecent: true
      },
      globalStore
    )
    this.favouritesLibrary = new LibraryListControler(
      {
        ...this.paginationOptions,
        onlyFavourites: true
      },
      globalStore
    )
    this.loadSaved()
    makeAutoObservable(this)

    autorun(() => {
      const serializeListController = (controller: LibraryListControler) => {
        return toJS(pick(controller, ['sort', 'layout', 'showHidden']))
      }
      console.log('Saving LibraryPageController data')
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          mainLibrary: serializeListController(this.mainLibrary),
          recentGames: serializeListController(this.recentGames),
          favouritesLibrary: serializeListController(this.favouritesLibrary)
        })
      )
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
    return this.listScrollPosition?.top < this.previousListScrollPosition?.top
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
}
