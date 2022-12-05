import { makeAutoObservable } from 'mobx'
import { Disclosure } from '../common/utils'
import { Game } from '../model/Game'

export default class MainPageController {
    headerHeight = 0
    gameModal = new Disclosure<{
        game: Game
        parentList?: Game[]
        listIndex?: number
    }>()

    constructor() {
        makeAutoObservable(this)
    }
}
