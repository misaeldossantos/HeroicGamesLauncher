import React from 'react'
import { observer } from 'mobx-react'
import MotionBox from '../ui/MotionBox'
import chroma from 'chroma-js'
import epicBackground from '../../assets/epic-background.jpg'
import epicLogo from '../../assets/epic-white.png'
import gogBackground from '../../assets/gog-background.jpg'
import gogLogo from '../../assets/gog-logo.svg'
import useGlobalStore from '../../core/hooks/useGlobalStore'
import StoreCard from './StoreCard'

const StoresSidebar: React.FC<{
    selected: { legendary: boolean; gog: boolean }
    onStoreClick: (store: string) => void
}> = ({ selected, onStoreClick }) => {
    const { layoutPreferences } = useGlobalStore()

    return (
        <MotionBox
            variants={{
                hover: {
                    width: 250
                }
            }}
            transition={{ type: 'tween', duration: 0.2 }}
            whileHover={'hover'}
            initial={{
                width: SIDEBAR_WIDTH
            }}
            display={'flex'}
            flexDirection={'column'}
            gap={6}
            p={5}
            zIndex={999}
            bg={'primary'}
            position={'relative'}
            borderRightColor={'text'}
            borderRightWidth={1}
            overflow={'hidden'}
        >
            <MotionBox
                pointerEvents={'none'}
                variants={{
                    hover: {
                        background: 'transparent'
                    }
                }}
                position={'absolute'}
                top={0}
                right={0}
                left={0}
                bottom={0}
                bg={`linear-gradient(
            to left,
            ${chroma(layoutPreferences.themeColors.primary).alpha(1)} 0%,
            ${chroma(layoutPreferences.themeColors.primary).alpha(0.3)} 100%
        )`}
                zIndex={1000}
            />
            <StoreCard
                selected={selected.legendary}
                bgImage={epicBackground}
                logo={epicLogo}
                name={'Epic Games'}
                color={'#2e77ff'}
                onClick={() => {
                    onStoreClick('legendary')
                }}
            />
            <StoreCard
                selected={selected.gog}
                onClick={() => {
                    onStoreClick('gog')
                }}
                bgImage={gogBackground}
                logo={gogLogo}
                color={'#b60fff'}
                name={'Epic Games'}
            />
        </MotionBox>
    )
}

export const SIDEBAR_WIDTH = 120

export default observer(StoresSidebar)
