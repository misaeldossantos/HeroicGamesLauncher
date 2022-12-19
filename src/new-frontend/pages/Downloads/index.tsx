import React, { useMemo } from 'react'
import { observer } from 'mobx-react'
import { Box, Divider, Flex, Grid, Text } from '@chakra-ui/react'
import useGlobalStore from '../../core/hooks/useGlobalStore'
import ResponsiveContainer from '../../components/ui/ResponsiveContainer'
import StoresSidebar, {
    SIDEBAR_WIDTH
} from '../../components/stores/StoresSidebar'
import { StateBox } from '../../core/state/common/utils'
import DownloadItem from './DownloadItem'

const Downloads = () => {
    const { mainPage, gameDownloadQueue } = useGlobalStore()
    const selected = useMemo(() => StateBox.create(new Set()), [])
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
                    legendary: selected.val!.has('epic'),
                    gog: selected.val!.has('gog')
                }}
                onStoreClick={(runner) => {
                    const store = runner === 'legendary' ? 'epic' : 'gog'
                    if (selected.val!.has(store)) {
                        selected.val!.delete(store)
                    } else {
                        selected.val!.add(store)
                    }
                }}
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
                <Box>
                    <ResponsiveContainer
                        display={'flex'}
                        flexDirection={'column'}
                        py={5}
                    >
                        <Text fontSize={30}>Downloads</Text>
                    </ResponsiveContainer>
                </Box>

                <Divider />

                <Box overflowY={'scroll'}>
                    <ResponsiveContainer
                        gap={6}
                        display={'flex'}
                        flexDirection={'column'}
                        py={10}
                    >
                        {gameDownloadQueue.queue.map((item) => {
                            return (
                                <DownloadItem item={item} key={item.appName} />
                            )
                        })}
                    </ResponsiveContainer>
                </Box>
            </Grid>
        </Flex>
    )
}

export default observer(Downloads)
