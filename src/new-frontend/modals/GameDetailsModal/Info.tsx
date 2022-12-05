import React from 'react'
import { Game } from '../../core/state/model/Game'
import { observer } from 'mobx-react'
import { Divider, Flex, Grid, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import HowLongToBeat from './HowLongToBeat'
import Anticheat from './Anticheat'
import GameRequirements from './GameRequirements'

const Info: React.FC<{ game: Game }> = ({ game }) => {
    const { t } = useTranslation('gamepage', {})

    const {
        extra,
        install: { install_size, platform } = {},
        developer
    } = game.data

    return (
        <Flex flexDirection={'column'} gap={10} flex={1}>
            <Item title={t('info.description', 'Description')}>
                <Text maxW={800}>
                    {extra?.about?.description ||
                        extra?.about?.longDescription ||
                        ''}
                </Text>
            </Item>
            <Grid
                gridTemplateColumns={'repeat(auto-fill, minmax(250px, 1fr))'}
                gap={5}
            >
                <Item title={t('info.developer', 'Developer')}>
                    {developer}
                </Item>
                <Item
                    title={t('game.downloadSize', 'Download Size')}
                    r-if={game.downloadSize}
                >
                    {game.downloadSize!}
                </Item>
                <Item title={t('info.size', 'Size')} r-if={install_size}>
                    {install_size!}
                </Item>
                <Item
                    title={t('info.installedPlatform', 'Installed Platform')}
                    r-if={platform}
                >
                    {platform!}
                </Item>
                <Item title={t('info.status', 'Status')}>
                    {getInstallLabel(t, game)}
                </Item>
            </Grid>
            <Divider />
            <HowLongToBeat
                howLongToBeatInfo={game.howLongToBeatInfo!}
                r-if={game.howLongToBeatInfo}
            />
            <Anticheat
                anticheatInfo={game.anticheatInfo!}
                r-if={game.anticheatInfo}
            />
            <GameRequirements
                requirements={game.data.extra!.reqs}
                r-if={game.data.extra?.reqs?.length}
            />
        </Flex>
    )
}

function getInstallLabel(
    t: (key: string, defaulValue?: unknown) => string,
    game: Game
) {
    // if (isReparing) {
    //     return `${t('status.reparing')} ${percent ? `${percent}%` : '...'}`
    // }

    if (game.status === 'moving') {
        return `${t('status.moving')}`
    }

    // const currentProgress =
    //     getProgress(progress) >= 99
    //         ? ''
    //         : `${
    //               percent && bytes
    //                   ? `${percent}% [${bytes}] ${eta ? `ETA: ${eta}` : ''}`
    //                   : '...'
    //           }`

    if (game.isUpdating && game.isInstalled) {
        // if (!currentProgress) {
        //     return `${t(
        //         'status.processing',
        //         'Processing files, please wait'
        //     )}...`
        // }
        // if (eta && eta.includes('verifying')) {
        //     return `${t('status.reparing')}: ${percent} [${bytes}]`
        // }
        // return `${t('status.updating')} ${currentProgress}`
        return ''
    }

    if (!game.isUpdating && game.isInstalling) {
        // if (!currentProgress) {
        //     return `${t(
        //         'status.processing',
        //         'Processing files, please wait'
        //     )}...`
        // }
        // return `${t('status.installing')} ${currentProgress}`
        return ''
    }

    if (game.isQueued) {
        return `${t('status.queued', 'Queued')}`
    }

    if (game.hasUpdate) {
        // return (
        // <span onClick={async () => handleUpdate()} className="updateText">
        //     {`${t('status.installed')} - ${t(
        //         'status.hasUpdates',
        //         'New Version Available!'
        //     )} (${t('status.clickToUpdate', 'Click to Update')})`}
        // </span>
        // )
        return ''
    }

    if (game.isInstalled) {
        return t('status.installed')
    }

    return t('status.notinstalled')
}

const Item: React.FC<{ title: string; children: unknown }> = ({
    title,
    children
}) => {
    return (
        <Flex flexDirection={'column'}>
            <Text color={'accent'} fontSize={20} fontWeight={'bold'}>
                {title}:
            </Text>
            <Text>{children as never}</Text>
        </Flex>
    )
}

export default observer(Info)
