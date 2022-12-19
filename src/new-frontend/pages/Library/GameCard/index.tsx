import { observer } from 'mobx-react'
import React, { useMemo } from 'react'
import fallbackImage from 'new-frontend/assets/heroic_card.jpg'
import CachedImage from 'new-frontend/components/ui/CachedImage'
import { Game } from 'new-frontend/core/state/model/Game'
import { Box, Flex, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import {
    Check,
    Download,
    PlayCircle,
    Star,
    StarBorderOutlined,
    StopCircle
} from '@mui/icons-material'
import chroma from 'chroma-js'
import useGlobalStore from '../../../core/hooks/useGlobalStore'
import MotionBox from '../../../components/ui/MotionBox'
import styled from 'styled-components'

interface Card {
    buttonClick: () => void
    hasUpdate: boolean
    forceCard?: boolean
    isRecent: boolean
    game: Game
    layout: string
}

const GameCard = ({ game, buttonClick }: Card) => {
    const { art_square: cover, runner, title } = game.data

    const { layoutPreferences, gameDownloadQueue } = useGlobalStore()

    const imageSrc = getImageFormatting()

    function getImageFormatting() {
        const imageBase = cover
        if (imageBase === 'fallback') {
            return fallbackImage
        }
        if (runner === 'legendary') {
            return `${imageBase}?h=400&resize=1&w=300`
        } else {
            return imageBase
        }
    }

    const gradientColor = layoutPreferences.themeColors.primary
    const clickSound = useMemo(() => new Audio('/audio/click.mp3'), [])

    return (
        <MotionBox
            position={'relative'}
            cursor={'pointer'}
            width={240}
            onClick={() => {
                clickSound.play()
                buttonClick()
            }}
            whileFocus={{
                borderColor: 'yellow'
            }}
            height={380}
            display={'flex'}
            whileHover={'hover'}
            flexDirection={'column'}
            overflow={'hidden'}
            borderRadius={12}
            borderWidth={2}
            borderColor={'text'}
        >
            <Container
                bgImage={imageSrc}
                gradientColor={gradientColor}
                position={'absolute'}
                top={0}
                right={0}
                bgPosition={'center'}
                left={0}
                bottom={0}
            />
            <MotionBox
                onClick={buttonClick}
                cursor={'pointer'}
                variants={{ hover: { scale: 1.1 } }}
                overflow={'hidden'}
                position={'relative'}
            >
                <CachedImage
                    draggable={false}
                    style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        filter: game.isInstalled ? undefined : 'grayscale(90%)'
                    }}
                    src={imageSrc ? imageSrc : fallbackImage}
                    alt="cover"
                />
            </MotionBox>
            <Flex
                height={'35%'}
                p={5}
                position={'absolute'}
                bottom={0}
                right={0}
                left={0}
                bg={'primary'}
                flexDirection={'column'}
                flexGrow={1}
                justifyContent={'space-between'}
                zIndex={1}
                gap={5}
            >
                <Text
                    fontSize={16}
                    width={'100%'}
                    fontWeight={'bold'}
                    overflowY={'hidden'}
                >
                    {title}
                </Text>
                <Flex
                    gap={2}
                    onClick={(e) => {
                        e.stopPropagation()
                        e.nativeEvent.stopImmediatePropagation()
                    }}
                    flexDirection={'row'}
                >
                    <Star
                        r-if={game.isFavourite}
                        onClick={() => game.unFavorite()}
                        style={{ color: 'yellow' }}
                    />
                    <StarBorderOutlined
                        r-else
                        onClick={() => game.favorite()}
                    />
                    <Flex flex={1} />
                    <React.Fragment r-if={game.isInstalled}>
                        <StopCircle
                            r-if={game.isPlaying}
                            onClick={() => game.stop()}
                        />
                        <PlayCircle r-else onClick={async () => game.play()} />
                    </React.Fragment>
                    <Download
                        r-else
                        onClick={() => {
                            gameDownloadQueue!.addGame(game!)
                        }}
                    />
                </Flex>
            </Flex>
        </MotionBox>
    )
}

const Container = styled(({ gradientColor, selected, ...props }) => (
    <MotionBox display={'flex'} {...props} />
))(
    ({ gradientColor }) => `
    &:after {
        content: '';
        width: 100%;
        height: 100%;
        background: linear-gradient(
            to bottom,
            ${chroma(gradientColor).alpha(0.8)} 0%,
            ${chroma(gradientColor).alpha(1)} 100%
        );
    }
`
)

export default observer(GameCard)
