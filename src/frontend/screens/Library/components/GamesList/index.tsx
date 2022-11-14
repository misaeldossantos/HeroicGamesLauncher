import React, { useContext } from 'react'
import { GameInfo, Runner, SideloadGame } from 'common/types'
import cx from 'classnames'
import GameCard from '../GameCard'
import ContextProvider from 'frontend/state/ContextProvider'
import { useTranslation } from 'react-i18next'

interface Props {
  library: (GameInfo | SideloadGame)[]
  layout?: string
  isFirstLane?: boolean
  handleGameCardClick: (
    app_name: string,
    runner: Runner,
    gameInfo: GameInfo
  ) => void
  onlyInstalled?: boolean
  isRecent?: boolean
}

export const GamesList = ({
  library = [],
  layout = 'grid',
  handleGameCardClick,
  isFirstLane = false,
  onlyInstalled = false,
  isRecent = false
}: Props): JSX.Element => {
  const { gameUpdates } = useContext(ContextProvider)
  const { t } = useTranslation()

  return (
    <div
      style={!library.length ? { backgroundColor: 'transparent' } : {}}
      className={cx({
        gameList: layout === 'grid',
        gameListLayout: layout === 'list',
        firstLane: isFirstLane
      })}
    >
      {layout === 'list' && (
        <div className="gameListHeader">
          <span>{t('game.title', 'Game Title')}</span>
          <span>{t('game.status', 'Status')}</span>
          <span>{t('game.store', 'Store')}</span>
          <span>{t('wine.actions', 'Action')}</span>
        </div>
      )}
      {!!library.length &&
        library.map((gameInfo) => {
          const {
            title,
            art_square,
            art_cover,
            app_name,
            is_installed,
            runner,
            install: { platform }
          } = gameInfo

          let is_dlc = false
          let install_size: string | undefined
          let version: string | undefined
          let art_logo: string | undefined
          let cloud_save_enabled = false
          if (gameInfo.runner !== 'sideload') {
            is_dlc = gameInfo.install.is_dlc ?? false
            install_size = gameInfo.install.install_size
            version = gameInfo.install.version
            art_logo = gameInfo.art_logo
            cloud_save_enabled = gameInfo.cloud_save_enabled
          }

          if (is_dlc) {
            return null
          }
          if (!is_installed && onlyInstalled) {
            return null
          }

          const hasUpdate = is_installed && gameUpdates?.includes(app_name)
          return (
            <GameCard
              key={app_name}
              runner={runner}
              cover={art_square}
              coverList={art_cover}
              logo={art_logo}
              hasCloudSave={cloud_save_enabled}
              title={title}
              appName={app_name}
              isInstalled={is_installed}
              version={`${version}`}
              size={`${install_size}`}
              hasUpdate={hasUpdate}
              buttonClick={() => {
                if (gameInfo.runner !== 'sideload')
                  handleGameCardClick(app_name, runner, gameInfo)
              }}
              forceCard={layout === 'grid'}
              installedPlatform={platform}
              isRecent={isRecent}
            />
          )
        })}
    </div>
  )
}
