import { Box } from '../common/utils'
import { makeAutoObservable } from 'mobx'
import { SortGame } from '../common/common'
import { LibraryPaginationOptions } from '../fetch-data/LibraryPagination'

export default class LibraryListControler {
    readonly sort = Box.create<SortGame>('installed')
    readonly layout = Box.create<'grid' | 'list'>('grid')
    readonly showHidden = Box.create(false)

    constructor(private paginationOptions: Partial<LibraryPaginationOptions>) {
        makeAutoObservable(this)
    }
}
