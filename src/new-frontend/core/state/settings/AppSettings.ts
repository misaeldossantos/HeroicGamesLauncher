import { makeAutoObservable } from 'mobx'
import i18next from 'i18next'
import { configStore } from '../../../../frontend/helpers/electronStores'

export default class AppSettings {
    language = localStorage.getItem('language')

    constructor() {
        makeAutoObservable(this)
    }

    setLanguage(language: string) {
        this.language = language
        window.api.changeLanguage(language)
        localStorage.setItem('language', language)
        configStore.set('language', language)
        i18next.changeLanguage(language)
    }
}
