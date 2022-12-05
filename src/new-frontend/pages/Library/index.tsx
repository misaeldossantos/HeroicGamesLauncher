import { observer } from 'mobx-react'
import React, { useEffect, useRef } from 'react'
import GamesSection from './GamesSection'
import useGlobalStore from 'new-frontend/hooks/useGlobalStore'
import Lottie from 'lottie-react'
import lottieRefreshing from 'new-frontend/assets/loading-controler.json'
import { AnimatePresence } from 'framer-motion'
import { Box, Flex, Grid } from '@chakra-ui/react'
import Sidebar from './Sidebar'
import MotionBox from '../../components/ui/MotionBox'

const Library = () => {
    const globalStore = useGlobalStore()
    const { libraryController, mainPage } = globalStore
    const listingRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (listingRef.current) {
            listingRef.current.scrollTo(libraryController.listScrollPosition)
        }

        const interval = setInterval(() => {
            libraryController.setListDimensions({
                height: listingRef.current?.scrollHeight || 0,
                width: listingRef.current?.scrollWidth || 0
            })
        }, 1000)
        return () => {
            clearInterval(interval)
        }
    }, [listingRef])

    return (
        <Grid
            templateColumns={'300px 1fr'}
            templateRows={'1fr'}
            flexDirection={'row'}
        >
            <Sidebar />
            <Flex
                overflowY={'scroll'}
                height={'100vh'}
                p={5}
                pt={mainPage.headerHeight + 50}
                onScroll={(ev) => {
                    const { scrollTop, scrollLeft } = ev.currentTarget
                    libraryController.setListScrollPosition({
                        left: scrollLeft,
                        top: scrollTop
                    })
                }}
            >
                <AnimatePresence>
                    <Box flex={'100% 1 1'} ref={listingRef}>
                        <span id="top" />
                        <MotionBox
                            r-if={globalStore.refreshingLibrary}
                            animate={{ opacity: 1 }}
                            initial={{ opacity: 0 }}
                            exit={{ opacity: 0 }}
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            flexDirection={'column'}
                            height={'100%'}
                            flex={1}
                        >
                            <Lottie
                                animationData={lottieRefreshing}
                                style={{ height: 400, width: 400 }}
                            />
                        </MotionBox>
                        <GamesSection
                            r-else
                            pageController={libraryController}
                        />
                    </Box>
                </AnimatePresence>
            </Flex>
        </Grid>
    )
}

export default observer(Library)
