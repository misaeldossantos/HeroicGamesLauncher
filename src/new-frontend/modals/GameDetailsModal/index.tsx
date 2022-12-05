import React, { useEffect, useMemo } from 'react'
import { observer } from 'mobx-react'
import useGlobalStore from '../../hooks/useGlobalStore'
import { Flex, Grid, Spinner, Text } from '@chakra-ui/react'
import GamePicture from './GamePicture'
import Modal from '../../components/ui/Modal'
import { Box } from '../../core/state/common/utils'
import Info from './Info'
import Log from './Log'
import Settings from './Settings'
import {
    DownloadOutlined,
    PlayCircle,
    Star,
    StarOutline,
    StopCircle
} from '@mui/icons-material'
import MotionBox from '../../components/ui/MotionBox'
import { Game } from '../../core/state/model/Game'
import { useTranslation } from 'react-i18next'
import MenuActions from './MenuActions'

const GameDetailsModal = () => {
    const { mainPage } = useGlobalStore()
    const { gameModal } = mainPage
    const { props: { game } = {} } = gameModal
    const tab = useMemo(() => new Box<'info' | 'log' | 'settings'>('info'), [])

    useEffect(() => {
        tab.set('info')
    }, [gameModal.opened])

    return (
        <Modal
            modal={gameModal}
            title={game?.data.title || ''}
            menu={<MenuActions game={game!} r-if={game} />}
        >
            <Grid gridTemplateColumns={'600px 1fr'} r-if={game} height={'100%'}>
                <Flex pointerEvents={'none'}>
                    <Flex position={'absolute'} top={0} bottom={0}>
                        <GamePicture
                            art_square={game?.data.art_square as string}
                            store={game?.data.runner as string}
                            imgStyle={{
                                '-webkit-mask-image':
                                    '-webkit-linear-gradient(360deg, rgba(0,0,0,1) 0%, transparent 90%)',
                                objectFit: 'cover'
                            }}
                        />
                    </Flex>
                </Flex>
                <Flex flex={1} r-if={game} flexDirection={'column'}>
                    <Grid
                        gridTemplateRows={'auto 0.92fr auto'}
                        overflow={'hidden'}
                        height={'100%'}
                    >
                        <Flex
                            justifyContent={'center'}
                            alignItems={'center'}
                            flexDirection={'row'}
                        >
                            <Tab
                                label={'Informações'}
                                selected={tab.is('info')}
                                onSelect={() => tab.set('info')}
                            />
                            <Tab
                                label={'Configurações'}
                                selected={tab.is('settings')}
                                onSelect={() => tab.set('settings')}
                                r-if={game!.isInstalled}
                            />
                            <Tab
                                label={'Estou com problema'}
                                selected={tab.is('log')}
                                onSelect={() => tab.set('log')}
                                r-if={game!.isInstalled}
                            />
                        </Flex>

                        <Flex
                            py={30}
                            px={10}
                            overflowY={'auto'}
                            flex={1}
                            // style={{
                            //     '-webkit-mask-image':
                            //         '-webkit-linear-gradient(white 95%, transparent 100%)'
                            // }}
                        >
                            <Info r-if={tab.is('info')} game={game!} />
                            <Log r-else-if={tab.is('log')} game={game!} />
                            <Settings
                                r-else-if={tab.is('settings')}
                                game={game!}
                            />
                        </Flex>

                        <Actions game={game!} />
                    </Grid>
                </Flex>
            </Grid>
        </Modal>
    )
}

const Actions: React.FC<{ game: Game }> = observer(({ game }) => {
    const { gameDownloadQueue } = useGlobalStore()
    const { t } = useTranslation('gamepage', {})
    return (
        <Flex
            justifyContent={'flex-end'}
            p={10}
            gap={5}
            alignItems={'flex-end'}
        >
            <ActionButton
                label={'Favorite'}
                icon={<Star />}
                color={'yellow'}
                textColor={'black'}
                onClick={() => game!.favorite()}
                r-if={!game!.isFavourite}
            />
            <ActionButton
                label={'Unfavorite'}
                icon={<StarOutline />}
                color={'orange'}
                textColor={'black'}
                onClick={() => game!.unFavorite()}
                r-else
            />
            <React.Fragment r-if={game!.isInstalled}>
                <ActionButton
                    label={t('label.playing.start')}
                    icon={<PlayCircle />}
                    color={'#248a1c'}
                    onClick={async () => game!.play()}
                    r-if={!game!.isPlaying}
                />
                <ActionButton
                    r-else
                    label={t('label.playing.stop')}
                    icon={<StopCircle />}
                    color={'#f63333'}
                    onClick={async () => game!.stop()}
                />
            </React.Fragment>
            <React.Fragment r-else>
                <ActionButton
                    loading={game!.isInstalling}
                    label={t('button.install')}
                    icon={<DownloadOutlined />}
                    color={'primary'}
                    onClick={async () => gameDownloadQueue!.addGame(game!)}
                />
            </React.Fragment>
        </Flex>
    )
})

const ActionButton: React.FC<{
    onClick: () => void
    color: string
    label: string
    loading?: boolean
    icon?: JSX.Element
    textColor?: string
}> = ({ onClick, color, textColor, icon, label, loading }) => {
    return (
        <MotionBox
            whileTap={{
                y: 4
            }}
            onClick={onClick}
        >
            <Flex
                bg={color}
                color={textColor}
                p={3}
                borderRadius={6}
                gap={2}
                alignItems={'center'}
                cursor={'pointer'}
                as={'button'}
                height={50}
                width={250}
                justifyContent={'center'}
            >
                <Spinner r-if={loading} />
                <React.Fragment r-else>
                    {icon}
                    <Text
                        fontSize={16}
                        fontWeight={'bold'}
                        textTransform={'uppercase'}
                    >
                        {label}
                    </Text>
                </React.Fragment>
            </Flex>
        </MotionBox>
    )
}

const Tab: React.FC<{
    label: string
    selected?: boolean
    onSelect?: () => void
}> = ({ label, selected, onSelect }) => {
    return (
        <Flex
            onClick={onSelect}
            px={5}
            alignItems={'center'}
            flexDirection={'column'}
            gap={1}
            cursor={'pointer'}
        >
            <Text color={selected ? 'accent' : undefined} fontSize={20}>
                {label}
            </Text>
            <Flex
                h={0.5}
                width={'50%'}
                bg={selected ? 'accent' : 'transparent'}
            ></Flex>
        </Flex>
    )
}

export default observer(GameDetailsModal)
