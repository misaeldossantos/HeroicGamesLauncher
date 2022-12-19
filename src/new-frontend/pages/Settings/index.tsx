import React from 'react'
import { observer } from 'mobx-react'
import { Flex, Text } from '@chakra-ui/react'
import useGlobalStore from '../../core/hooks/useGlobalStore'
import { Outlet, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import ResponsiveContainer from '../../components/ui/ResponsiveContainer'

const Settings = () => {
    const { mainPage } = useGlobalStore()
    const { t } = useTranslation()

    const navigate = useNavigate()
    const location = useLocation()

    return (
        <ResponsiveContainer
            display={'grid'}
            gridTemplateColumns={'300px 1fr'}
            height={'100vh'}
        >
            <Flex
                flexDirection={'column'}
                p={10}
                pt={mainPage.headerHeight + 40}
            >
                <Text fontSize={25} mb={10}>
                    {t('Settings', 'Settings')}
                </Text>
                {menu.map((item) => {
                    return (
                        <MenuItem
                            selected={location?.pathname.startsWith(item.to!)}
                            key={item.label}
                            onClick={() => {
                                navigate(item.to!)
                            }}
                            label={item.label}
                        />
                    )
                })}
            </Flex>
            <Flex
                flex={1}
                flexDirection={'column'}
                gap={45}
                p={10}
                overflowY={'auto'}
                pt={mainPage.headerHeight + 40}
            >
                <Outlet />
            </Flex>
        </ResponsiveContainer>
    )
}

const MenuItem: React.FC<{
    label: string
    selected?: boolean
    onClick?: () => void
}> = ({ label, selected, onClick }) => {
    return (
        <MotionText
            onClick={onClick}
            py={2}
            whileHover={{ color: 'white' }}
            cursor={'pointer'}
            color={selected ? 'accent !important' : 'disabled'}
        >
            {label}
        </MotionText>
    )
}

const menu = [
    {
        label: 'Geral'
    },
    {
        label: 'Interface',
        to: '/settings/interface'
    },
    {
        label: 'Arquivos dos jogos'
    },
    {
        label: 'Wine'
    },
    {
        label: 'Padrões'
    },
    {
        label: 'Avançado'
    }
]

const MotionText = motion(Text)

export default observer(Settings)
