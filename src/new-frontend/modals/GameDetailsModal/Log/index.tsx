import './index.css'
import React, { useEffect } from 'react'
import { Game } from '../../../core/state/model/Game'
import LogBox from './LogBox'
import { observer } from 'mobx-react'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

const Log: React.FC<{
    game: Game
}> = ({ game }) => {
    const { t } = useTranslation()
    useEffect(() => {
        game.log.load()
    }, [])

    return (
        <Flex
            flex={1}
            overflow={'auto'}
            height={'100%'}
            gap={4}
            flexDirection={'column'}
        >
            <LogBox
                logFileContent={game.log.content!}
                r-if={!game.log.loading && game.log.content}
            />
            <Text fontSize={30}>
                {t(
                    'setting.log.instructions_title',
                    'How to report a problem?'
                )}
            </Text>
            <Text fontSize={18}>
                {t(
                    'setting.log.instructions',
                    'Join our Discord and look for the channel that matches your operating system. Share the content of the logs displayed here, and include a clear description of the problem with any relevant information and details.'
                )}
            </Text>
            <Flex gap={5}>
                <Button colorScheme="blue">Report issue (discord)</Button>
                <Button variant="link">Copy log</Button>
            </Flex>
        </Flex>
    )
}

export default observer(Log)
