import React, { useEffect, useRef } from 'react'
import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react'
import { Search } from '@mui/icons-material'
import useGlobalStore from '../../../core/hooks/useGlobalStore'
import { StateBox } from '../../../core/state/common/utils'
import Input from '../../../components/forms/Input'
import ResponsiveContainer from '../../../components/ui/ResponsiveContainer'
import { runInAction } from 'mobx'
import chroma from 'chroma-js'
import ViewTab from '../../../components/ui/ViewTab'

const Header = () => {
    const { libraryController, layoutPreferences } = useGlobalStore()

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current) {
            const { current } = containerRef
            const boundingRect = current.getBoundingClientRect()
            const { height } = boundingRect
            runInAction(() => {
                libraryController.headerHeight = height
            })
        }
    }, [containerRef])

    return (
        <Flex
            flexDirection={'column'}
            right={0}
            left={0}
            pt={10}
            px={10}
            gap={10}
            borderBottomColor={'primary'}
            borderBottomWidth={1}
            ref={containerRef}
            bg={`linear-gradient(120deg, ${chroma(
                layoutPreferences.themeColors.primary
            ).darken(0.2)} 10%, ${chroma(
                layoutPreferences.themeColors.primary
            ).darken(0.8)} 80%)`}
            zIndex={998}
            position={'absolute'}
        >
            <ResponsiveContainer alignSelf={'center'}>
                <SearchBar valueBox={libraryController.search} />
            </ResponsiveContainer>
            <Flex flexDirection={'row'} alignSelf={'center'}>
                <ViewTab
                    title={'Recentes'}
                    selected={libraryController.mode.is('recents')}
                    onClick={() => libraryController.mode.set('recents')}
                />
                <ViewTab
                    title={'Favoritos'}
                    selected={libraryController.mode.is('favorites')}
                    onClick={() => libraryController.mode.set('favorites')}
                />

                <ViewTab
                    title={'Todos'}
                    selected={libraryController.mode.is('all')}
                    onClick={() => libraryController.mode.set('all')}
                />
                <ViewTab title={'+ Lista'} />
            </Flex>
        </Flex>
    )
}

const SearchBar: React.FC<{ valueBox: StateBox<string> }> = observer(
    ({ valueBox }) => {
        return (
            <Input
                placeholder={'Pesquisar'}
                left={<Search style={{ color: 'gray' }} />}
                variant={'filled'}
                width={500}
                onChange={(val) => valueBox.set(val)}
                value={valueBox.val}
            />
        )
    }
)

export default observer(Header)
