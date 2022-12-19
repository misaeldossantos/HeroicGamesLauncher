import { makeAutoObservable } from 'mobx'
import { Disclosure } from '../common/utils'
import { Game } from '../model/Game'
import { GameInstallSettings } from '../common/common'

export default class MainPageController {
    headerHeight = 0
    gameModal = new Disclosure<{
        game: Game
        parentList?: Game[]
        listIndex?: number
    }>()
    requestDownloadModal = new Disclosure<
        {
            game: Game
        },
        GameInstallSettings
    >()
    loginModal = new Disclosure<{
        store: 'epic' | 'gog'
    }>()

    constructor() {
        makeAutoObservable(this)
    }
}
