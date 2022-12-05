import GameStore from './GameStore'
import { makeAutoObservable } from 'mobx'

export default class GOGGameStore extends GameStore {
    constructor() {
        super()
        makeAutoObservable(this)
    }

    async auth(sid: string) {
        // TODO: impl
    }

    get name(): string {
        return 'gog-games'
    }
}
