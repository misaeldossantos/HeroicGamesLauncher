import { Box } from '../common/utils'
import chroma from 'chroma-js'
import { makeAutoObservable } from 'mobx'

export default class LayoutPreferences {
    // TODO: move GlobalState logic to here
    themeName = 'heroic'
    zoomPercent = 100
    primaryColor = Box.create('rgb(36,88,255)')
    primaryFontFamily = ''
    secondaryFontFamily = ''

    constructor() {
        makeAutoObservable(this)
    }

    get accentColor() {
        return chroma(this.primaryColor.val!).brighten(1).css()
    }
}
