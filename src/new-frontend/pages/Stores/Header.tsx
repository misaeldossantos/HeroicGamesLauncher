import React from 'react'
import ResponsiveContainer from '../../components/ui/ResponsiveContainer'
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import useGlobalStore from '../../core/hooks/useGlobalStore'
import GameStore from '../../core/state/game-stores/GameStore'
import { useTranslation } from 'react-i18next'
import { StateBox } from '../../core/state/common/utils'
import { observer } from 'mobx-react'
import ViewTab from '../../components/ui/ViewTab'

const Header: React.FC<{
    store: GameStore
    currentViewBox: StateBox<string>
}> = ({ store, currentViewBox }) => {
    const { mainPage, confirmationModal } = useGlobalStore()

    const { loginModal } = mainPage

    const { t } = useTranslation()

    const logout = async () => {
        if (
            await confirmationModal.requestData({
                message: t(
                    'confirmation.want-leave',
                    'Do you really want to leave?'
                )
            })
        ) {
            store.logout()
        }
    }

    return (
        <Box>
            <ResponsiveContainer>
                <Box
                    p={10}
                    gap={10}
                    display={'flex'}
                    flexDirection={'row'}
                    alignItems={'center'}
                >
                    <Box>
                        <Image src={store.logoImage} height={100} />
                    </Box>
                    <Flex flexDirection={'column'} gap={1}>
                        <Text fontSize={25} fontWeight={'bold'}>
                            {store.displayName}
                        </Text>
                        <Flex
                            r-if={store.isLogged}
                            gap={1}
                            flexDirection={'column'}
                        >
                            <Text>
                                {store.user!.name} @{store.user!.username}
                            </Text>
                            <Flex
                                mt={3}
                                flexDir={'row'}
                                gap={5}
                                alignItems={'center'}
                            >
                                <Button onClick={logout}>Logout</Button>
                                <Button>Open store</Button>
                                <Button
                                    variant={'link'}
                                    isLoading={store.refreshing}
                                    onClick={() => {
                                        store.refreshLibrary(true)
                                    }}
                                >
                                    Refresh library
                                </Button>
                            </Flex>
                        </Flex>

                        <Button
                            r-else
                            mt={3}
                            onClick={() => {
                                loginModal.open({
                                    store: currentViewBox.val! as any
                                })
                            }}
                        >
                            Fazer login
                        </Button>
                    </Flex>
                </Box>
                <Flex r-if={store.isLogged}>
                    <ViewTab
                        title={'Jogos instalados'}
                        selected
                        onClick={() => {}}
                    />
                </Flex>
            </ResponsiveContainer>
        </Box>
    )
}

export default observer(Header)
