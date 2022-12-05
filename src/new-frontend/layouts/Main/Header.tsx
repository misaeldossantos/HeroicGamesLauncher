import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import useGlobalStore from '../../hooks/useGlobalStore'
import { runInAction } from 'mobx'
import {
    Box,
    Flex,
    Grid,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Text
} from '@chakra-ui/react'
import chroma from 'chroma-js'
import logo from '../../../frontend/assets/heroic-icon.svg'
import {
    Check,
    Download,
    Games,
    Palette,
    Settings,
    ShoppingCart
} from '@mui/icons-material'
import { observer } from 'mobx-react'

const Header = () => {
    const { t } = useTranslation()
    const { mainPage } = useGlobalStore()

    const { layoutPreferences } = useGlobalStore()
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current) {
            const { current } = containerRef
            const boundingRect = current.getBoundingClientRect()
            const { height } = boundingRect
            runInAction(() => {
                mainPage.headerHeight = height
            })
        }
    }, [containerRef])

    return (
        <Flex
            ref={containerRef}
            position={'absolute'}
            top={0}
            right={0}
            left={0}
            flexDirection={'row'}
            alignItems={'center'}
            p={5}
            zIndex={1000}
            bg={chroma(layoutPreferences.primaryColor.val!).alpha(0.4).css()}
            boxShadow={'0 4px 30px rgba(0, 0, 0, 0.1)'}
            backdropFilter={'blur(30px)'}
        >
            <img src={logo as never} style={{ height: 40 }} />
            <Flex flex={1}></Flex>
            <MenuItem
                label={t('Library', 'Library')}
                selected
                icon={<Games />}
            />
            <MenuItem label={'Downloads'} icon={<Download />} />
            <MenuItem label={'Stores'} icon={<ShoppingCart />} />
            <MenuItem icon={<Settings />} label={t('Settings', 'Settings')} />
            <Flex flex={1}></Flex>
            <Flex gap={5}>
                <Popover>
                    <PopoverTrigger>
                        <Box cursor={'pointer'}>
                            <Palette />
                        </Box>
                    </PopoverTrigger>
                    <PopoverContent mr={5} borderColor={'gray'}>
                        <Grid
                            gridTemplateColumns={
                                'repeat(auto-fill, minmax(30px, 1fr))'
                            }
                            gridGap={'1.5rem'}
                            p={5}
                        >
                            {colors.map((color) => {
                                return (
                                    <ColorBox
                                        color={color}
                                        key={color}
                                        selected={
                                            layoutPreferences.primaryColor
                                                .val === color
                                        }
                                        onClick={() =>
                                            layoutPreferences.primaryColor.set(
                                                color
                                            )
                                        }
                                    />
                                )
                            })}
                        </Grid>
                    </PopoverContent>
                </Popover>
            </Flex>
        </Flex>
    )
}

const colors = [
    'rgb(36,88,255)',
    'rgb(5,40,185)',
    'rgb(255,102,36)',
    'rgb(255,36,43)',
    'rgb(132,237,51)',
    'rgb(36,138,28)'
]

const ColorBox: React.FC<{
    color: string
    selected?: boolean
    onClick: () => void
}> = ({ color, selected, onClick }) => {
    return (
        <Flex
            justifyContent={'center'}
            onClick={onClick}
            height={25}
            width={45}
            bg={color}
            borderRadius={3}
            border={'1.5px solid white'}
        >
            <Check r-if={selected} />
        </Flex>
    )
}

const MenuItem = ({
    label,
    selected,
    icon,
    outlined
}: {
    label: string
    selected?: boolean
    icon?: JSX.Element
    outlined?: boolean
}) => {
    return (
        <Flex
            py={3}
            px={5}
            bg={selected ? '#1f1d2b' : 'transparent'}
            userSelect={'none'}
            borderRadius={10}
            cursor={'pointer'}
            gap={3}
            border={outlined && !selected ? `1px solid white` : undefined}
            alignItems={'center'}
            flexDirection={'row'}
        >
            {icon}
            <Text>{label}</Text>
        </Flex>
    )
}

export default observer(Header)
