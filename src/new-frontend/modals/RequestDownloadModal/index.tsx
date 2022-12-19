import React, { useEffect } from 'react'
import { observer, useLocalObservable } from 'mobx-react'
import { Disclosure } from '../../core/state/common/utils'
import { Game } from '../../core/state/model/Game'
import Modal from '../../components/ui/Modal'
import { Box, Divider, Flex, Grid, Text } from '@chakra-ui/react'
import FormField from '../../components/forms/FormField'
import { useTranslation } from 'react-i18next'
import WineForm from '../../components/settings/WineForm'
import FolderInput from '../../components/forms/FolderInput'
import Switch from '../../components/forms/Switch'
import ActionButton from '../../components/ui/ActionButton'
import { Download } from '@mui/icons-material'
import useGlobalStore from '../../core/hooks/useGlobalStore'
import { faDownload, faHardDrive } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useComputedValue, {
    SkipComputedChange
} from '../../core/hooks/useComputedValue'
import useStateBox from '../../core/hooks/useStateBox'
import { runInAction, toJS } from 'mobx'
import { GameInstallSettings } from '../../core/state/common/common'
import useAutoEffect from '../../core/hooks/useAutoEffect'
import { configStore } from '../../../frontend/helpers/electronStores'
import { AppSettings, WineInstallation } from '../../../common/types'
import { removeSpecialcharacters } from '../../../frontend/helpers'

const RequestDownloadModal: React.FC<{
    modal: Disclosure<{ game: Game }, GameInstallSettings>
}> = ({ modal }) => {
    const globalStore = useGlobalStore()
    const { gameDownloadQueue } = globalStore
    const { game } = modal.props || {}
    const { t } = useTranslation('gamepage', {})

    const form = useLocalObservable(() => ({
        useDefaultSettings: false,
        installPath: '',
        wine: {
            winePrefix: '',
            wineVersion: null
        } as {
            winePrefix: string
            wineVersion: WineInstallation | null
        },
        game
    }))

    useEffect(() => {
        if (game) {
            game.loadInstallInfo()
        }
    }, [game])

    const installPathIsBlur = useStateBox(true)

    const installCheck = useComputedValue(async () => {
        const { game } = modal.props || {}
        const { installPath } = form

        if (!game || !installPath || !installPathIsBlur.val) {
            throw new SkipComputedChange()
        }

        return gameDownloadQueue.checkInstallPath(game, installPath)
    })

    useAutoEffect(() => {
        const { game } = modal.props || {}
        if (!game) return

        const {
            defaultWinePrefix: prefixFolder,
            wineVersion,
            winePrefix: defaultPrefix
        } = configStore.get('settings') as AppSettings

        if (form.useDefaultSettings) {
            runInAction(() => {
                form.wine = {
                    winePrefix: defaultPrefix,
                    wineVersion
                }
            })
        } else {
            const sugestedWinePrefix = `${prefixFolder}/${removeSpecialcharacters(
                game!.data.title
            )}`
            runInAction(() => {
                form.wine = {
                    winePrefix: sugestedWinePrefix,
                    wineVersion
                }
            })
        }
    })

    const sendToQueue = () => {
        modal.onReturn(toJS(form) as never)
    }

    return (
        <Modal
            title={`Download game: ${game?.data.title}`}
            modal={modal}
            width={100}
            minHeight={700}
            minWidth={900}
            height={'70%'}
        >
            <Grid templateRows={'1fr auto'} r-if={game}>
                <Box position={'relative'} overflowY={'scroll'}>
                    <Flex
                        p={6}
                        gap={8}
                        flexDirection={'column'}
                        position={'absolute'}
                        inset={0}
                    >
                        <Flex justifyContent={'space-between'}>
                            <Flex flexDir={'column'} gap={5}>
                                <Flex gap={5} alignItems={'center'}>
                                    <FontAwesomeIcon icon={faDownload} />
                                    <Text>
                                        {t(
                                            'game.downloadSize',
                                            'Download Size'
                                        )}
                                        : {game!.totalDownloadSizeFormatted}
                                    </Text>
                                </Flex>

                                <Flex gap={5} alignItems={'center'}>
                                    <FontAwesomeIcon icon={faHardDrive} />
                                    <Text>
                                        {t('game.installSize', 'Install Size')}:{' '}
                                        {game!.installDiskSizeFormatted}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Flex>

                        <Divider />

                        {/* TODO: generate default value */}
                        <FormField parent={form} path={'installPath'}>
                            <FolderInput
                                onBlur={() => installPathIsBlur.set(true)}
                                onFocus={() => installPathIsBlur.set(false)}
                                label={t('install.path', 'Select Install Path')}
                                fileDialogTitle={t('box.wineprefix')}
                                appendNewFolder={game!.data.title}
                            />
                        </FormField>

                        <FormField
                            parent={form}
                            path={'useDefaultSettings'}
                            r-if={globalStore.systemDependsOnWine}
                        >
                            <Switch
                                label={t(
                                    'setting.use-default-wine-settings',
                                    'Use Default Wine Settings'
                                )}
                            />
                        </FormField>

                        <WineForm
                            formObj={form.wine}
                            r-if={
                                globalStore.systemDependsOnWine &&
                                !form.useDefaultSettings
                            }
                        />
                    </Flex>
                    {/*  TODO: add sdl and installDlcs  */}
                </Box>
                <Flex p={10} justifyContent={'flex-end'}>
                    <ActionButton
                        label={'Install'}
                        icon={<Download />}
                        color={'accent'}
                        textColor={'black'}
                        onClick={sendToQueue}
                    />
                </Flex>
            </Grid>
        </Modal>
    )
}

export default observer(RequestDownloadModal)
