import React, { useRef } from 'react'
import { Runner } from 'common/types'
import GameCard from '../GameCard'
import { Game } from 'new-frontend/core/state/model/Game'
import { observer } from 'mobx-react'
import useGlobalStore from 'new-frontend/core/hooks/useGlobalStore'
import { Grid } from '@chakra-ui/react'

interface Props {
    library: Game[]
    layout?: string
    handleGameCardClick?: (app_name: string, runner: Runner, game: Game) => void
    onlyInstalled?: boolean
    isRecent?: boolean
    listName?: string
}

const GamesList = (props: Props): JSX.Element => {
    // const { t } = useTranslation()
    const { library = [], layout = 'grid' } = props

    return (
        <Grid
            gridTemplateColumns={'repeat(auto-fill, minmax(250px, 1fr))'}
            padding={'0 var(--space-md-fixed) var(--space-3xl)'}
            rowGap={'40px'}
            margin={' var(--space-md) 0'}
            key={props.listName + '-' + layout}
            scrollSnapType={'mandatory'}
        >
            {/*<AnimatePresence>*/}
            {library.map((item, index) => (
                <GameItem
                    key={item.appName}
                    game={item}
                    index={index}
                    {...props}
                    listLength={library.length}
                />
            ))}
            {/*</AnimatePresence>*/}
        </Grid>
    )
}

function getPercValue(val: number, perc: number) {
    return (val * perc) / 100
}

const GameItem = observer(
    ({
        game,
        onlyInstalled,
        index,
        layout = 'grid',
        listName,
        isRecent = false
    }: {
        game: Game
        index: number
        listLength: number
    } & Props) => {
        const { libraryController, mainPage } = useGlobalStore()
        const wrapperRef = useRef<HTMLDivElement>(null)

        // const cardVisible = useComputedValue(() => {
        //     // to track list height
        //     libraryController.listDimensions.height
        //     const scrollPosition = libraryController.listScrollPosition
        //     if (!scrollPosition) {
        //         return false
        //     }
        //     const bodyHeight = document.body?.clientHeight || 0
        //     const { offsetTop = 0 } = wrapperRef.current || {}
        //     const diff = offsetTop - scrollPosition.top
        //     const percOfScreen = getPercValue(bodyHeight, 50)
        //     return diff > -percOfScreen && diff < bodyHeight + percOfScreen
        // })

        const {
            app_name,
            is_installed,
            install: { is_dlc }
        } = game.data

        if (is_dlc) {
            return null
        }
        if (!is_installed && onlyInstalled) {
            return null
        }

        const { hasUpdate } = game

        const layoutId = app_name + '-' + listName + '-' + layout

        return (
            <div
                style={{
                    minHeight: layout === 'grid' ? 300 : 30,
                    minWidth: 1
                }}
                ref={wrapperRef}
            >
                <div
                // r-if={cardVisible}
                // layoutId={layoutId}
                // animate={{
                //     scale: 1,
                //     opacity: 1,
                //     transition: {
                //         delay: 0.03
                //     }
                // }}
                // initial={{
                //     scale: layout === 'grid' ? 0.7 : 1,
                //     opacity: 0
                // }}
                // exit={{
                //     opacity: 0,
                //     transition: {
                //         delay: 0.03
                //     }
                // }}
                // transition={{
                //     type: 'tween'
                // }}
                >
                    <GameCard
                        key={app_name}
                        hasUpdate={hasUpdate}
                        buttonClick={() =>
                            mainPage.gameModal.open({
                                game,
                                parentList:
                                    libraryController.pagination.allResults,
                                listIndex: index
                            })
                        }
                        forceCard={layout === 'grid'}
                        isRecent={isRecent}
                        game={game}
                        layout={layout}
                    />
                </div>
            </div>
        )
    }
)

export default React.memo(GamesList)
