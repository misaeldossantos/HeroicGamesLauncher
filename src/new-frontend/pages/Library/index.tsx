import { observer } from 'mobx-react'
import React, { useEffect, useRef } from 'react'
import GamesSection from './GamesSection'
import useGlobalStore from 'new-frontend/core/hooks/useGlobalStore'
import Lottie from 'lottie-react'
import lottieRefreshing from 'new-frontend/assets/loading-controler.json'
import { AnimatePresence } from 'framer-motion'
import { Box, Flex } from '@chakra-ui/react'
import Header from './Header'
import MotionBox from '../../components/ui/MotionBox'
import StoresSidebar, {
    SIDEBAR_WIDTH
} from '../../components/stores/StoresSidebar'

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
        <MotionBox
            display={'flex'}
            overflow={'hidden'}
            height={'100vh'}
            pt={mainPage.headerHeight}
        >
            <StoresSidebar
                selected={libraryController.enabled.runners}
                onStoreClick={(store) =>
                    libraryController.toggleEnabled('runners.' + store)
                }
            />
            <Flex overflow={'hidden'} flex={1}>
                <Header />
                <Flex
                    overflowY={'scroll'}
                    ml={SIDEBAR_WIDTH}
                    inset={0}
                    p={10}
                    position={'absolute'}
                    pt={libraryController.headerHeight + 100}
                    flex={1}
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
            </Flex>
        </MotionBox>
    )
}

export default observer(Library)
