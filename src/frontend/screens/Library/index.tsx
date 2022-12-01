import './index.css'
import { observer } from 'mobx-react'
import { Header } from '../../components/UI'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import GamesSection from './components/GamesSection'
import useGlobalStore from '../../hooks/useGlobalStore'
import { getLibraryTitle } from './constants'
import Lottie from 'lottie-react'
import lottieRefreshing from 'frontend/assets/loading-controler.json'
import { AnimatePresence, motion } from 'framer-motion'

const Library = () => {
  const globalStore = useGlobalStore()
  const { libraryController } = globalStore
  const listingRef = useRef<HTMLDivElement>(null)

  const { listNameVisible } = libraryController

  const tab = listNameVisible.get()

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

  // const backToTop = () =>
  //   listingRef.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

  return (
    <>
      <Header />
      <AnimatePresence>
        <div
          className="listing"
          ref={listingRef}
          onScroll={(ev) => {
            const { scrollTop, scrollLeft } = ev.currentTarget
            libraryController.setListScrollPosition({
              left: scrollLeft,
              top: scrollTop
            })
          }}
        >
          <span id="top" />
          {globalStore.refreshingLibrary ? (
            <motion.div
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                height: '100%',
                flex: 1
              }}
            >
              <Lottie
                animationData={lottieRefreshing}
                style={{ height: 400, width: 400 }}
              />
              {/*<span>{t('loading.default', 'Loading')}</span>*/}
            </motion.div>
          ) : (
            <>
              {tab === 'recent' && <RecentGames />}
              {tab === 'favourite' && <FavouriteList />}
              {tab === 'all' && <MainLibrary />}
            </>
          )}
        </div>
      </AnimatePresence>
      {/*<Observer>*/}
      {/*  {() => {*/}
      {/*    return (*/}
      {/*      <AnimatePresence>*/}
      {/*        {libraryController.isListScrollingToTop && (*/}
      {/*          <motion.div*/}
      {/*            key={'backToTopBtn'}*/}
      {/*            layoutId={'backToTopBtn'}*/}
      {/*            exit={{ bottom: -document.body?.clientHeight }}*/}
      {/*            animate={{ bottom: 0 }}*/}
      {/*            initial={{ bottom: -document.body?.clientHeight }}*/}
      {/*          >*/}
      {/*            <button id="backToTopBtn" onClick={backToTop}>*/}
      {/*              <ArrowDropUp className="material-icons" />*/}
      {/*            </button>*/}
      {/*          </motion.div>*/}
      {/*        )}*/}
      {/*      </AnimatePresence>*/}
      {/*    )*/}
      {/*  }}*/}
      {/*</Observer>*/}
    </>
  )
}

const _MainLibrary = () => {
  const { t } = useTranslation()
  const { libraryController } = useGlobalStore()
  const { mainLibrary } = libraryController

  return (
    <GamesSection
      listController={mainLibrary}
      title={getLibraryTitle(libraryController.category.get(), t)}
    />
  )
}

const MainLibrary = React.memo(_MainLibrary)

const _RecentGames = () => {
  const { t } = useTranslation()
  const { libraryController } = useGlobalStore()
  const { recentGames } = libraryController

  return (
    <GamesSection
      listController={recentGames}
      title={t('Recent', 'Played Recently')}
      isRecent
    />
  )
}

const RecentGames = React.memo(_RecentGames)

const _FavouriteList = () => {
  const { t } = useTranslation()
  const { libraryController } = useGlobalStore()
  const { favouritesLibrary } = libraryController

  return (
    <GamesSection
      listController={favouritesLibrary}
      title={t('favourites', 'Favourites')}
    />
  )
}

const FavouriteList = React.memo(_FavouriteList)

export default observer(Library)
