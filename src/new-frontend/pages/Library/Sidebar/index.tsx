import React from 'react'
import { Flex, Input, Text } from '@chakra-ui/react'
import { observer, Observer } from 'mobx-react'
import { Games, Search, Star } from '@mui/icons-material'
import useGlobalStore from '../../../hooks/useGlobalStore'
import { Box } from '../../../core/state/common/utils'
import { faLinux, faWindows } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Sidebar = () => {
    const { mainPage, libraryController } = useGlobalStore()
    const { enabled, mode } = libraryController
    return (
        <Flex
            mt={mainPage.headerHeight + 20}
            flexDirection={'column'}
            p={3}
            gap={10}
        >
            <Observer>
                {() => {
                    return <SearchBar valueBox={libraryController.search} />
                }}
            </Observer>
            <Flex flexDirection={'column'} gap={4}>
                <Text>Order:</Text>
                <Text>Alfabética</Text>

                <Text>Mode:</Text>

                <MenuItem
                    label={'Recent games'}
                    outlined
                    selected={mode.is('recents')}
                    onClick={() => mode.set('recents')}
                />

                <MenuItem
                    label={'Favorites'}
                    outlined
                    selected={mode.is('favorites')}
                    onClick={() => mode.set('favorites')}
                />

                <MenuItem
                    label={'All'}
                    outlined
                    selected={mode.is('all')}
                    onClick={() => mode.set('all')}
                />

                <Text>Include:</Text>

                <MenuItem
                    label={'Not installed games'}
                    selected={enabled.notInstalled}
                    outlined
                    onClick={() =>
                        libraryController.toggleEnabled('notInstalled')
                    }
                />

                <MenuItem
                    label={'Epic games'}
                    selected={enabled.runners.legendary}
                    outlined
                    onClick={() =>
                        libraryController.toggleEnabled('runners.legendary')
                    }
                    // icon={<img src={epic as never} style={{ fill: 'white' }} />}
                />
                <MenuItem
                    label={'GOG games'}
                    selected={enabled.runners.gog}
                    onClick={() =>
                        libraryController.toggleEnabled('runners.gog')
                    }
                    icon={<Games />}
                    outlined
                />

                <MenuItem
                    label={'Windows games'}
                    icon={<FontAwesomeIcon icon={faWindows} />}
                    selected={enabled.platforms.windows}
                    onClick={() =>
                        libraryController.toggleEnabled('platforms.windows')
                    }
                    outlined
                />
                <MenuItem
                    label={'Linux games'}
                    outlined
                    selected={enabled.platforms.linux}
                    icon={<FontAwesomeIcon icon={faLinux} />}
                    onClick={() =>
                        libraryController.toggleEnabled('platforms.linux')
                    }
                />
            </Flex>
        </Flex>
    )
}

const SearchBar: React.FC<{ valueBox: Box<string> }> = observer(
    ({ valueBox }) => {
        return (
            <Flex
                flexDirection={'row'}
                gap={2}
                alignItems={'center'}
                borderWidth={1.5}
                borderColor={'white'}
                borderRadius={6}
                px={2}
            >
                <Search />
                <Input
                    _placeholder={{
                        color: 'lightgray'
                    }}
                    _focus={{
                        outline: 'none',
                        border: 'none'
                    }}
                    _active={{
                        border: 'none',
                        outline: 'none'
                    }}
                    p={0}
                    border={'none'}
                    value={valueBox.val}
                    placeholder={'Pesquisar'}
                    onChange={(ev) => valueBox.set(ev.target.value)}
                />
            </Flex>
        )
    }
)

const MenuItem = ({
    label,
    onClick,
    selected,
    icon,
    outlined
}: {
    label: string
    selected?: boolean
    icon?: JSX.Element
    outlined?: boolean
    onClick?: () => void
}) => {
    return (
        <Flex
            onClick={onClick}
            p={2}
            bg={selected ? '#1f1d2b' : 'transparent'}
            userSelect={'none'}
            borderRadius={30}
            cursor={'pointer'}
            gap={3}
            justifyContent={'center'}
            border={
                outlined && !selected
                    ? `1px solid white`
                    : '1px solid transparent'
            }
            alignItems={'center'}
            flexDirection={'row'}
        >
            {icon}
            <Text>{label}</Text>
        </Flex>
    )
}

export default observer(Sidebar)
