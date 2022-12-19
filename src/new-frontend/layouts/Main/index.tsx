import React from 'react'
import chroma from 'chroma-js'
import { Outlet } from 'react-router-dom'
import useGlobalStore from '../../core/hooks/useGlobalStore'
import Header from './Header'
import MotionBox from '../../components/ui/MotionBox'
import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react'

const Main = () => {
    return (
        <Container>
            <Header />
            <Box>
                <Outlet />
            </Box>
        </Container>
    )
}

const Container: React.FC<{ children: JSX.Element[] }> = ({ children }) => {
    const { layoutPreferences } = useGlobalStore()
    return (
        <MotionBox
            h={'100vh'}
            animate={{
                // background: `linear-gradient(135deg, ${chroma(
                //     layoutPreferences.themeColors.primary
                // )
                //     .desaturate(0.1)
                //     .css()} 0%, ${chroma(
                //     layoutPreferences.themeColors.secondary
                // )
                //     .darken(2)
                //     .css()} 100%)`
                background: `linear-gradient(120deg, ${chroma(
                    layoutPreferences.themeColors.primary
                ).darken(0.2)} 10%, ${chroma(
                    layoutPreferences.themeColors.primary
                ).darken(0.8)} 80%)`
            }}
            color={'white'}
            overflow={'hidden'}
            display={'grid'}
            gridTemplateRows={'min-content 1fr'}
        >
            {children}
        </MotionBox>
    )
}

export default observer(Main)
