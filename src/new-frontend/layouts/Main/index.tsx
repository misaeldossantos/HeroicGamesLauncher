import React from 'react'
import chroma from 'chroma-js'
import { Outlet } from 'react-router-dom'
import useGlobalStore from '../../hooks/useGlobalStore'
import Header from './Header'
import MotionBox from '../../components/ui/MotionBox'

const Main = () => {
    return (
        <Container>
            <Header />
            <Outlet />
        </Container>
    )
}

const Container: React.FC<{ children: JSX.Element[] }> = ({ children }) => {
    const { layoutPreferences } = useGlobalStore()
    return (
        <MotionBox
            flex={1}
            h={'100%'}
            animate={{
                background: `linear-gradient(135deg, ${chroma(
                    layoutPreferences.primaryColor.val!
                )
                    .darken(1)
                    .css()} 0%, ${chroma(layoutPreferences.primaryColor.val!)
                    .darken(43)
                    .css()} 100%)`
            }}
            color={'white'}
            overflow={'hidden'}
        >
            {children}
        </MotionBox>
    )
}

export default Main
