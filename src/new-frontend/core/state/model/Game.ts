import { AntiCheatInfo, AppSettings, GameInfo } from 'common/types'
import { makeAutoObservable, runInAction } from 'mobx'
import {
    getInstallInfo,
    launch,
    sendKill,
    size,
    syncSaves
} from 'new-frontend/core/helpers'
// import { GameDownloadQueue } from './GameDownloadQueue'
import { t } from 'i18next'
import { LegendaryInstallInfo } from '../../../../common/types/legendary'
import { GogInstallInfo } from '../../../../common/types/gog'
import { HowLongToBeatEntry } from 'howlongtobeat'
import { bridgeStore } from '../global'

class Log {
    content!: string
    loading = false

    constructor(private game: Game) {
        makeAutoObservable(this)
    }

    async load() {
        this.loading = true
        this.content = await window.api.getLogContent({
            appName: this.game.appName,
            defaultLast: true
        })
        this.loading = false
    }
}

export class Game {
    installInfo?: LegendaryInstallInfo | GogInstallInfo | null = null
    readonly log = new Log(this)
    howLongToBeatInfo?: HowLongToBeatEntry | null
    anticheatInfo?: AntiCheatInfo | null
    hasShortcuts = false
    addedToSteam = false
    settings: Partial<AppSettings> = {}
    settingsLoaded = false

    constructor(
        public data: GameInfo // private downloadQueue: GameDownloadQueue
    ) {
        makeAutoObservable(this)
        window.api
            .isGameAvailable({
                appName: data.app_name,
                runner: data.runner
            })
            .then((available) => {
                this.isAvailable = available
            })

        window.api.getHowLongToBeat(data.title).then((howLongToBeatInfo) => {
            this.howLongToBeatInfo = howLongToBeatInfo
        })

        window.api
            .getAnticheatInfo(data.namespace)
            .then((anticheatInfo: AntiCheatInfo | null) => {
                this.anticheatInfo = anticheatInfo
            })

        // Check for game shortcuts on desktop and start menu
        window.api.shortcutsExists(data.app_name, data.runner).then((added) => {
            this.hasShortcuts = added
        })

        window.api.isAddedToSteam(data.app_name, data.runner).then((added) => {
            this.addedToSteam = added
        })

        window.api.requestGameSettings(data.app_name).then((settings) => {
            this.settings = settings
            this.settingsLoaded = true
        })
        // TODO: clear subscription on instance destroy to avoid memory leak
        // reaction(
        //     () => toJS(this.settings),
        //     (config) => {
        //         if (this.settingsLoaded) {
        //             // auto saves settings on change
        //             writeConfig({ appName: data.app_name, config })
        //         }
        //     }
        // )
    }

    isHidden = false
    isFavourite = false
    isAvailable = true

    loadInstallInfo() {
        if (this.installInfo) {
            return
        }

        const installPlatform =
            this.data.install.platform || this.data.is_linux_native
                ? 'linux'
                : this.data.is_mac_native
                ? 'Mac'
                : 'Windows'

        getInstallInfo(this.appName, this.data.runner, installPlatform)
            .then((info) => {
                if (!info) {
                    throw 'Cannot get game info'
                }
                runInAction(() => {
                    this.installInfo = info as never
                })
            })
            .catch((error) => {
                console.error(error)
                window.api.logError(`${`${error}`}`)
            })
    }

    get status() {
        return bridgeStore.gameStatusByAppName[this.appName]?.status
    }

    get installDiskSizeFormatted() {
        return (
            this.installInfo?.manifest?.disk_size &&
            size(Number(this.installInfo?.manifest?.disk_size))
        )
    }

    get totalDownloadSizeFormatted() {
        if (this.installInfo?.manifest?.download_size) {
            return size(Number(this.installInfo?.manifest?.download_size))
        }
        return ''
    }

    uninstall() {
        if (!this.isInstalled) {
            return
        }
    }

    get isRecent() {
        return bridgeStore.recentAppNames.includes(this.data.app_name)
    }

    get isInstalled() {
        return this.data.is_installed
    }

    get hasUpdate() {
        return (
            this.isInstalled &&
            bridgeStore.updatedAppNames?.includes(this.data.app_name)
        )
    }

    get isInstalling() {
        return this.status === 'installing'
    }

    get isUninstalling() {
        return this.status === 'uninstalling'
    }

    get isQueued() {
        return this.status === 'queued'
    }

    get isUpdating() {
        return this.status === 'updating'
    }

    get isPlaying() {
        return this.status === 'playing'
    }

    hide() {
        this.isHidden = true
    }

    show() {
        this.isHidden = false
    }

    favorite() {
        this.isFavourite = true
    }

    unFavorite() {
        this.isFavourite = false
    }

    stop() {
        if (!this.isPlaying) {
            return
        }
        sendKill(this.appName, this.data.runner)
    }

    get appName() {
        return this.data.app_name
    }

    get downloadSize() {
        return (
            this.installInfo?.manifest?.download_size &&
            size(Number(this.installInfo?.manifest?.download_size))
        )
    }

    async play(launchArguments?: never) {
        if (this.isPlaying || this.isUpdating) {
            return
        }

        const { autoSyncSaves, savesPath, gogSaves } =
            await window.api.requestGameSettings(this.appName)

        const doAutoSyncSaves = async () => {
            if (this.data.runner === 'legendary') {
                await syncSaves(savesPath, this.appName, this.data.runner)
            } else if (this.data.runner === 'gog' && gogSaves) {
                await window.api.syncGOGSaves(gogSaves, this.appName, '')
            }
        }

        if (autoSyncSaves) {
            await doAutoSyncSaves()
        }

        await launch({
            appName: this.appName,
            t,
            launchArguments,
            runner: this.data.runner,
            hasUpdate: this.hasUpdate,
            syncCloud: false, //manually sync before and after so we can update the buttons
            showDialogModal: () => {
                return
            }
        })

        if (autoSyncSaves) {
            await doAutoSyncSaves()
        }
    }

    update() {
        // this.changeStatus('updating')
    }

    cancelProgress() {
        return
    }

    asRecent() {
        // this.isRecent = true
    }

    asNotRecent() {
        // this.isRecent = false
    }

    get gameStatus() {
        return bridgeStore.gameStatusByAppName[this.data.app_name]
    }
}
