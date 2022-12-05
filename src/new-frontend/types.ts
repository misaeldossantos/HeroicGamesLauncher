import { VersionInfo } from 'heroic-wine-downloader'
import {
    AppSettings,
    ButtonOptions,
    DialogType,
    DMQueueElement,
    GameInfo,
    Runner
} from 'common/types'

export type Category = 'all' | 'legendary' | 'gog' | 'sideload'

export type DialogModalOptions = {
    showDialog?: boolean
    title?: string
    message?: string
    buttons?: Array<ButtonOptions>
    type?: DialogType
}

export interface HiddenGame {
    appName: string
    title: string
}

export type FavouriteGame = HiddenGame

export interface InstallProgress {
    bytes: string
    eta: string
    folder?: string
    percent: number
}

export type RefreshOptions = {
    checkForUpdates?: boolean
    fullRefresh?: boolean
    library?: Runner | 'all'
    runInBackground?: boolean
}

export type SyncType = 'Download' | 'Upload' | 'Force download' | 'Force upload'

export interface WineVersionInfo extends VersionInfo {
    isInstalled: boolean
    hasUpdate: boolean
    installDir: string
}

export type ElWebview = {
    canGoBack: () => boolean
    canGoForward: () => boolean
    goBack: () => void
    goForward: () => void
    reload: () => void
    isLoading: () => boolean
    getURL: () => string
    copy: () => string
    selectAll: () => void
    findInPage: (text: string | RegExp) => void
}

export type WebviewType = HTMLWebViewElement & ElWebview

export interface GamepadActionStatus {
    [key: string]: {
        triggeredAt: { [key: number]: number }
        repeatDelay: false | number
    }
}

export type AntiCheatStatus =
    | 'Planned'
    | 'Denied'
    | 'Broken'
    | 'Supported'
    | 'Running'

export type AntiCheat =
    | 'Arbiter'
    | 'BattlEye'
    | 'Denuvo Anti-Cheat'
    | 'Easy Anti-Cheat'
    | 'EQU8'
    | 'FACEIT'
    | 'FairFight'
    | 'Mail.ru Anti-Cheat'
    | 'miHoYo Protect'
    | 'miHoYo Protect 2'
    | 'NEAC Protect'
    | 'Nexon Game Security'
    | 'nProtect GameGuard'
    | 'PunkBuster'
    | 'RICOCHET'
    | 'Sabreclaw'
    | 'Treyarch Anti-Cheat'
    | 'UNCHEATER'
    | 'Unknown (Custom)'
    | 'VAC'
    | 'Vanguard'
    | 'Warden'
    | 'XIGNCODE3'
    | 'Zakynthos'

declare global {
    interface Window {
        imageData: (
            src: string,
            canvas_width: number,
            canvas_height: number
        ) => Promise<string>
        setTheme: (themeClass: string) => void
    }
    interface WindowEventMap {
        'controller-changed': CustomEvent<{ controllerId: string }>
    }
}

export interface SettingsContextType {
    getSetting: <T extends keyof AppSettings>(
        key: T,
        fallback: NonNullable<AppSettings[T]>
    ) => NonNullable<AppSettings[T]>
    setSetting: <T extends keyof AppSettings>(
        key: T,
        value: AppSettings[T]
    ) => void
    config: Partial<AppSettings>
    isDefault: boolean
    appName: string
    runner: Runner
    gameInfo: GameInfo | null
    isMacNative: boolean
    isLinuxNative: boolean
}

export interface LocationState {
    fromGameCard: boolean
    runner: Runner
    isLinuxNative: boolean
    isMacNative: boolean
    gameInfo: GameInfo
}

export type DMQueue = {
    elements: DMQueueElement[]
    finished: DMQueueElement[]
}
