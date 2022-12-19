import React, { useMemo } from 'react'
import { Image, Text } from '@chakra-ui/react'
import chroma from 'chroma-js'

import styled from 'styled-components'
import MotionBox from '../../../components/ui/MotionBox'
import { observer } from 'mobx-react'

const StoreCard: React.FC<{
    selected?: boolean
    bgImage: string
    logo: string
    name: string
    onClick?: () => void
    color: string
}> = ({ onClick, color, selected, bgImage, logo, name }) => {
    const clickSound = useMemo(() => new Audio('/audio/click.mp3'), [])

    return (
        <MotionBox
            borderColor={selected ? color : ''}
            borderWidth={2}
            width={200}
            cursor={'pointer'}
            height={130}
            variants={{ hover: { x: 10 } }}
            transition={{ type: 'keyframes', duration: 0.2 }}
            flexDirection={'column'}
            borderRadius={10}
            whileHover={'hover'}
            overflow="hidden"
            onClick={() => {
                clickSound.play()
                onClick?.()
            }}
        >
            <StoreLogoContainer
                justifyContent={'center'}
                alignItems={'center'}
                transition={{ type: 'keyframes' }}
                h={'100%'}
                w={'100%'}
                bgImage={bgImage}
                bgPos={'center'}
                position={'relative'}
                selected={selected}
                gradientColor={color}
            >
                <Image
                    src={logo}
                    h={'50%'}
                    draggable={false}
                    position={'absolute'}
                />
            </StoreLogoContainer>
            <Text p={4} textAlign={'center'} fontWeight={'bold'}>
                {name}
            </Text>
        </MotionBox>
    )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StoreLogoContainer = styled(({ gradientColor, selected, ...props }) => (
    <MotionBox display={'flex'} {...props} />
))(
    ({ gradientColor, selected }) => `
    &:after {
        content: '';
        width: 100%;
        height: 100%;
        ${
            selected &&
            `background: linear-gradient(
            to bottom,
            ${chroma(gradientColor).alpha(0.5)} 0%,
            ${chroma(gradientColor).alpha(0.1)} 100%
        );`
        }
    }
`
)

export default observer(StoreCard)
