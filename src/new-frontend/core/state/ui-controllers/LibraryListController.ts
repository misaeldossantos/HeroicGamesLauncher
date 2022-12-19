import { StateBox } from '../common/utils'
import { makeAutoObservable } from 'mobx'
import { SortGame } from '../common/common'
import { LibraryPaginationOptions } from '../fetch-data/LibraryPagination'

export default class LibraryListControler {
    readonly sort = StateBox.create<SortGame>('installed')
    readonly layout = StateBox.create<'grid' | 'list'>('grid')
    readonly showHidden = StateBox.create(false)

    constructor(private paginationOptions: Partial<LibraryPaginationOptions>) {
        makeAutoObservable(this)
    }
}
