import React, { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import useGlobalStore from '../../core/hooks/useGlobalStore'
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
import logo from '../../../frontend/assets/heroic-icon.svg'
import {
    Check,
    Download,
    Palette,
    Settings,
    SportsEsports,
    SupervisedUserCircle
} from '@mui/icons-material'
import { observer } from 'mobx-react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router'

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

    const menu = [
        {
            label: t('Library', 'Library'),
            icon: <SportsEsports />,
            to: '/library'
        },
        {
            label: 'Downloads',
            icon: <Download />,
            to: '/downloads'
        },
        {
            label: 'Contas',
            icon: <SupervisedUserCircle />,
            to: '/stores'
        },
        {
            label: t('Settings', 'Settings'),
            icon: <Settings />,
            to: '/settings'
        }
    ]

    const navigate = useNavigate()
    const location = useLocation()
    const clickSound = useMemo(() => new Audio('/audio/click.mp3'), [])

    return (
        <Flex
            ref={containerRef}
            flexDirection={'row'}
            px={3}
            pt={3}
            zIndex={1000}
            // height={'100vh'}
            bg={'primary'}
            boxShadow={'0 4px 30px rgba(0, 0, 0, 0.2)'}
            backdropFilter={'blur(30px)'}
            position={'absolute'}
            left={0}
            right={0}
        >
            <Flex
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'center'}
                gap={5}
            >
                <img src={logo as never} style={{ height: 40 }} />
                {/*<Text fontWeight={'bold'}>Heroic Game Launcher</Text>*/}
            </Flex>
            <Flex flex={1}></Flex>
            {menu.map((item) => {
                return (
                    <MenuItem
                        {...item}
                        selected={location?.pathname.startsWith(item.to)}
                        key={item.label}
                        onClick={() => {
                            clickSound.play()
                            navigate(item.to)
                        }}
                    />
                )
            })}

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
                                            layoutPreferences.themeColors
                                                .primary === color
                                        }
                                        // onClick={() =>
                                        //     layoutPreferences.themeColors.primary.set(
                                        //         color
                                        //     )
                                        // }
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
    onClick?: () => void
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
    onClick
}: {
    label: string
    selected?: boolean
    icon?: JSX.Element
    outlined?: boolean
    onClick: () => void
}) => {
    return (
        <Flex
            py={3}
            userSelect={'none'}
            cursor={'pointer'}
            gap={3}
            color={selected ? 'accent' : 'disabled'}
            fontWeight={selected ? 'bold' : 'normal'}
            px={6}
            alignItems={'center'}
            flexDirection={'row'}
            borderBottomColor={selected ? 'accent' : 'transparent'}
            borderBottomWidth={2}
            onClick={onClick}
        >
            {icon}
            <Text>{label}</Text>
        </Flex>
    )
}

export default observer(Header)
