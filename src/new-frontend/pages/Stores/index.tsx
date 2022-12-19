import React from 'react'
import { observer } from 'mobx-react'
import { Box, Divider, Flex, Grid, Text } from '@chakra-ui/react'
import StoresSidebar, {
    SIDEBAR_WIDTH
} from '../../components/stores/StoresSidebar'
import useGlobalStore from '../../core/hooks/useGlobalStore'
import ResponsiveContainer from '../../components/ui/ResponsiveContainer'
import GameStore from '../../core/state/game-stores/GameStore'
import InstalledGame from './InstalledGame'
import Header from './Header'
import useStateBox from '../../core/hooks/useStateBox'

const Stores = () => {
    const {
        mainPage,
        stores: { epic, gog }
    } = useGlobalStore()

    const currentViewBox = useStateBox<'epic' | 'gog'>('epic')

    const store = currentViewBox.switch({
        epic,
        gog
    }) as GameStore

    return (
        <Flex
            flex={1}
            flexDirection={'row'}
            height={'100vh'}
            position={'relative'}
            pt={mainPage.headerHeight}
        >
            <StoresSidebar
                selected={{
                    legendary: currentViewBox.is('epic'),
                    gog: currentViewBox.is('gog')
                }}
                onStoreClick={(store) =>
                    currentViewBox.set(store === 'legendary' ? 'epic' : 'gog')
                }
            />
            <Grid
                templateRows={'min-content min-content 1fr'}
                position={'absolute'}
                pt={mainPage.headerHeight}
                left={SIDEBAR_WIDTH}
                right={0}
                bottom={0}
                top={0}
            >
                <Header currentViewBox={currentViewBox} store={store} />
                <Divider />
                <Box flex={1} overflowY={'scroll'} position={'relative'}>
                    <ResponsiveContainer display={'flex'} flex={1} py={10}>
                        <Box
                            r-if={!store.isLogged}
                            alignItems={'center'}
                            justifyContent={'center'}
                        >
                            <Text>
                                Você ainda não logou na {store.displayName}
                            </Text>
                        </Box>
                        <Flex flex={1} r-else gap={10} flexDir={'column'}>
                            {store.installedGames.map((game) => {
                                return (
                                    <InstalledGame
                                        key={game.appName}
                                        game={game}
                                    />
                                )
                            })}
                        </Flex>
                    </ResponsiveContainer>
                </Box>
            </Grid>
        </Flex>
    )
}

export default observer(Stores)
