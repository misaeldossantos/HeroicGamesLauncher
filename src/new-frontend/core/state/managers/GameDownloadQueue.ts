import { keyBy, merge, remove } from 'lodash'
import { makeAutoObservable, toJS } from 'mobx'
import { Game } from '../model/Game'
import { GlobalStore } from '../global/GlobalStore'
import { GameStatus, InstallPlatform } from '../../../../common/types'
import { size, writeConfig } from '../../helpers'
import { DMQueue } from '../../../../frontend/types'
import { bridgeStore } from '../global'
import { sendKill } from '../../../../frontend/helpers'

export type GameQueueItem = {
    appName: string
    addToQueueTime: number
    endTime: number
    startTime: number
    game: Game
    gameStatus: GameStatus
    installPath: string
}

export class GameDownloadQueue {
    queue: GameQueueItem[] = []

    constructor(private globalStore: GlobalStore) {
        makeAutoObservable(this)
        this.load()
    }

    load() {
        const { globalStore } = this
        window.api.getDMQueueInformation().then(({ elements }: DMQueue) => {
            this.queue = elements.map((element) => {
                const { addToQueueTime, endTime, startTime } = element
                return {
                    appName: element.params.appName,
                    addToQueueTime,
                    endTime,
                    startTime,
                    installPath: element.params.path,
                    get game() {
                        return globalStore.gameInstancesByAppName[
                            element.params.appName
                        ]
                    },
                    get gameStatus() {
                        return bridgeStore.gameStatusByAppName[
                            element.params.appName
                        ]
                    }
                }
            })
        })
    }

    async addGame(game: Game) {
        if (!game.isInstalled && !game.isQueued) {
            const settings =
                await this.globalStore.mainPage.requestDownloadModal.requestData(
                    {
                        game
                    }
                )

            // Write Default game config with prefix on linux
            if (this.globalStore.isLinux) {
                const globalSettings = await window.api.requestGameSettings(
                    game.data.app_name
                )

                writeConfig({
                    appName: game.data.app_name,
                    config: merge({
                        ...globalSettings,
                        ...settings.wine,
                        wineVersion: {
                            bin:
                                settings.wine?.wineVersion?.bin ||
                                globalSettings.wineVersion?.bin
                        }
                    })
                })
            }

            window.api.install({
                appName: game.data.app_name,
                path: toJS(settings.installPath),
                installDlcs: toJS(settings.installDlcs),
                sdlList: toJS(settings.sdlList),
                // installLanguage: this.globalStore.language,
                runner: game.data.runner,
                platformToInstall: this.globalStore.platform as InstallPlatform,
                gameInfo: toJS(game.data)
            })
        }
    }

    removeGame(game: Game) {
        remove(this.queue, { appName: game.appName })
        window.api.removeFromDMQueue(game.data.app_name)
    }

    get byAppName() {
        return keyBy(this.queue, 'appName')
    }

    resumeGameDownload(game: Game) {
        const inQueue = this.byAppName[game.appName]
        window.api.install({
            appName: game.data.app_name,
            path: toJS(inQueue.installPath),
            // installDlcs: toJS(settings.installDlcs),
            // sdlList: toJS(settings.sdlList),
            // installLanguage: this.globalStore.language,
            runner: game.data.runner,
            platformToInstall: this.globalStore.platform as InstallPlatform,
            gameInfo: toJS(game.data)
        })
    }

    stopInstallation(game: Game) {
        sendKill(game.appName, game.data.runner)
    }

    async checkInstallPath(game: Game, installPath: string) {
        const { message, free, validPath } = await window.api.checkDiskSpace(
            installPath
        )
        const diskSize = game.installInfo?.manifest?.disk_size
        if (diskSize) {
            const notEnoughDiskSpace = free < diskSize
            const spaceLeftAfter = size(free - Number(diskSize))
            // if (previousProgress.folder === installPath) {
            //     const progress = 100 - getProgress(previousProgress)
            //     notEnoughDiskSpace =
            //         free < (progress / 100) * Number(gameInstallInfo.manifest.disk_size)
            //
            //     spaceLeftAfter = size(
            //         free - (progress / 100) * Number(gameInstallInfo.manifest.disk_size)
            //     )
            // }
            return {
                notEnoughDiskSpace,
                spaceLeftAfter,
                message,
                validPath
            }
        }
        return {
            message,
            validPath
        }
    }
}
