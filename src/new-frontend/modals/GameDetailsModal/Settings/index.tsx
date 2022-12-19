import React from 'react'
import { Game } from '../../../core/state/model/Game'
import { observer } from 'mobx-react'
import { Flex } from '@chakra-ui/react'
import WineSection from './WineSection'
import OthersSection from './OthersSection'
import useGlobalStore from '../../../core/hooks/useGlobalStore'

const Settings: React.FC<{ game: Game }> = ({ game }) => {
    const globalStore = useGlobalStore()
    return (
        <Flex flex={1} flexDirection={'column'} gap={45}>
            <WineSection game={game} r-if={globalStore.systemDependsOnWine} />
            <OthersSection game={game} />
        </Flex>
    )
}

export default observer(Settings)
