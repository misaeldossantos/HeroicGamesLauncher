import { createRoot } from 'react-dom/client'
import React from 'react'
import Main from './layouts/Main'
import {
    ChakraProvider,
    ColorModeProvider,
    DarkMode,
    extendTheme,
    localStorageManager
} from '@chakra-ui/react'
import { configStore } from '../frontend/helpers/electronStores'
import i18next from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import HttpApi from 'i18next-http-backend'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Library from 'new-frontend/pages/Library'
import GameDetailsModal from './modals/GameDetailsModal'
import { observer } from 'mobx-react'
import useGlobalStore from './hooks/useGlobalStore'
import useComputedValue from './hooks/useComputedValue'

const container = document.getElementById('root')
const root = createRoot(container!) // createRoot(container!) if you use TypeScript

const storage: Storage = window.localStorage

let languageCode: string | undefined = configStore.get('language') as string

if (!languageCode) {
    languageCode = storage.getItem('language') || 'en'
    configStore.set('language', languageCode)
}

const Backend = new HttpApi(null, {
    addPath: 'build/locales/{{lng}}/{{ns}}',
    allowMultiLoading: false,
    loadPath: 'locales/{{lng}}/{{ns}}.json'
})

i18next
    // load translation using http -> see /public/locales
    // learn more: https://github.com/i18next/i18next-http-backend
    .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        lng: languageCode,
        react: {
            useSuspense: true
        },
        supportedLngs: [
            'az',
            'be',
            'bg',
            'bs',
            'ca',
            'cs',
            'de',
            'el',
            'en',
            'es',
            'et',
            'eu',
            'fa',
            'fi',
            'fr',
            'gl',
            'hr',
            'hu',
            'ja',
            'ko',
            'id',
            'it',
            'ml',
            'nb_NO',
            'nl',
            'pl',
            'pt',
            'pt_BR',
            'ro',
            'ru',
            'sk',
            'sv',
            'ta',
            'tr',
            'uk',
            'vi',
            'zh_Hans',
            'zh_Hant'
        ]
    })

const App = observer(() => {
    const globalStore = useGlobalStore()

    const theme = useComputedValue(() =>
        extendTheme({
            colors: {
                surface: '#2b2b2a',
                primary: globalStore.layoutPreferences.primaryColor.val,
                accent: globalStore.layoutPreferences.accentColor
            }
        })
    )

    return (
        <React.Suspense fallback={<></>}>
            <I18nextProvider i18n={i18next}>
                <ChakraProvider
                    resetCSS
                    theme={theme}
                    colorModeManager={localStorageManager}
                >
                    <ColorModeProvider>
                        <DarkMode>
                            <HashRouter>
                                <main className="content">
                                    <Routes>
                                        <Route path="/" element={<Main />}>
                                            <Route
                                                path="/"
                                                element={
                                                    <Navigate
                                                        to="/library"
                                                        replace
                                                    />
                                                }
                                            />
                                            <Route
                                                path={'/library'}
                                                element={<Library />}
                                            />
                                        </Route>
                                    </Routes>
                                    <GameDetailsModal />
                                </main>
                            </HashRouter>
                        </DarkMode>
                    </ColorModeProvider>
                </ChakraProvider>
            </I18nextProvider>
        </React.Suspense>
    )
})

root.render(<App />)
