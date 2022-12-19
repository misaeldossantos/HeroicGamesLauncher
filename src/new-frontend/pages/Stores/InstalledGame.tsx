import React from 'react'
import { Game } from '../../core/state/model/Game'
import { Button, Flex, Image, Text } from '@chakra-ui/react'
import { Settings } from '@mui/icons-material'
import ActionButton from '../../components/ui/ActionButton'

const InstalledGame: React.FC<{ game: Game }> = ({ game }) => {
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
                        <Text fontSize={16}>
                            Jogado pela última vez 12 dez 2022 10:00
                        </Text>
                    </Flex>
                    <Flex flexDir={'row'} gap={5}>
                        <Settings />
                    </Flex>
                </Flex>
                <Flex flex={1} />
                <Flex flexDir={'row'} alignSelf={'flex-end'} gap={5}>
                    <Button height={50} width={200}>
                        Desinstalar
                    </Button>
                    <ActionButton
                        onClick={() => {}}
                        color={'green'}
                        label={'Jogar agora'}
                    />
                </Flex>
            </Flex>
        </Flex>
    )
}

export default InstalledGame
