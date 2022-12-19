import React, { useEffect } from 'react'
import { GameQueueItem } from '../../core/state/managers/GameDownloadQueue'
import { observer } from 'mobx-react'
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { PlayCircle, Settings, Stop } from '@mui/icons-material'
import useGlobalStore from '../../core/hooks/useGlobalStore'

const DownloadItem: React.FC<{ item: GameQueueItem }> = ({ item }) => {
    const { game } = item
    const { gameDownloadQueue } = useGlobalStore()

    useEffect(() => game.loadInstallInfo(), [])

    const progress = item.gameStatus?.progress

    const inQueue = !item.startTime

    return (
        <Flex
            bg={'primary'}
            flexDirection={'row'}
            borderRadius={10}
            borderColor={'text'}
            borderWidth={1}
            overflow={'hidden'}
        >
            <Image src={game.data.art_square} width={130} />
            <Flex flexDir={'column'} p={5} flex={1} gap={1}>
                <Flex flexDir={'row'} justifyContent={'space-between'}>
                    <Flex flexDir={'column'}>
                        <Text fontSize={20} fontWeight={'semibold'}>
                            {game.data.title}
                        </Text>
                        <Text fontSize={18}>
                            {inQueue
                                ? 'Na fila'
                                : `Baixando. ${progress?.eta} restantes`}
                        </Text>
                    </Flex>
                    <Flex flexDir={'row'} gap={5}>
                        <Settings />
                        <Stop
                            r-if={progress?.eta}
                            onClick={() => {
                                gameDownloadQueue.stopInstallation(game)
                            }}
                        />
                        <PlayCircle
                            r-else
                            onClick={() =>
                                gameDownloadQueue.resumeGameDownload(game)
                            }
                        />
                    </Flex>
                </Flex>

                <Flex flex={1} />
                <Flex
                    justifyContent={'space-between'}
                    flexDir={'row'}
                    r-if={!inQueue}
                >
                    <Text fontSize={18}>
                        {progress?.percent}% baixado. {progress?.bytes} de{' '}
                        {game.downloadSize}
                    </Text>
                    <Text fontSize={18}>1.7Mb/s</Text>
                </Flex>
                <Box
                    r-if={!inQueue}
                    h={2}
                    w={'100%'}
                    bg={'accent.200'}
                    borderRadius={5}
                    overflow={'hidden'}
                >
                    <Box h={'100%'} w={`${progress?.percent}%`} bg={'accent'} />
                </Box>
            </Flex>
        </Flex>
    )
}

export default observer(DownloadItem)
