import chroma from 'chroma-js'
import { makeAutoObservable } from 'mobx'

class ThemeColors {
    primary = '#17313a'
    accent = '#1ed862'

    constructor() {
        makeAutoObservable(this)
    }

    get disabled() {
        return chroma('white').darken(1).css()
    }

    get secondary() {
        return chroma(this.primary!).desaturate(8).css()
    }
}

export default class LayoutPreferences {
    // TODO: move GlobalState logic to here
    themeName = 'heroic'
    zoomPercent = 100
    themeColors = new ThemeColors()

    constructor() {
        makeAutoObservable(this)
    }
}
