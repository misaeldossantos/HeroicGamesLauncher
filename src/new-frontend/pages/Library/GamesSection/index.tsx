import { observer } from 'mobx-react'
import GamesList from '../GamesList'
import React from 'react'
import LibraryPageController from '../../../core/state/ui-controllers/LibraryPageController'

const GamesSection: React.FC<{
    pageController: LibraryPageController
    isRecent?: boolean
}> = ({ isRecent, pageController }) => {
    const { pagination } = pageController

    return (
        <GamesList
            library={pagination.allResults}
            layout={pageController.layout.get()}
            isRecent={isRecent}
        />
    )
}

export default observer(GamesSection)
