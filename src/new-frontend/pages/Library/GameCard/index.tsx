import { observer } from 'mobx-react'
import React from 'react'
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

    return (
        <Box position={'relative'}>
            <BoxMotion
                borderRadius={10}
                onClick={buttonClick}
                whileHover={'hover'}
                cursor={'pointer'}
                variants={{ hover: { scale: 1.1 } }}
                overflow={'hidden'}
                position={'relative'}
            >
                <CachedImage
                    draggable={false}
                    style={{
                        borderRadius: 10,
                        height: 250,
                        objectFit: 'cover',
                        filter: game.isInstalled ? undefined : 'grayscale(90%)'
                    }}
                    src={imageSrc ? imageSrc : fallbackImage}
                    alt="cover"
                />
                <BoxMotion
                    position={'absolute'}
                    marginBottom={'-100%'}
                    variants={{ hover: { marginBottom: 0 } }}
                    transition={{ type: 'tween' }}
                    right={0}
                    left={0}
                    bottom={0}
                    display={'flex'}
                    p={4}
                    width={'100%'}
                    height={'50%'}
                    flexDirection={'column'}
                    overflow={'hidden'}
                    bg={'rgba(0, 0, 0, 0.8)'}
                    gap={2}
                    justifyContent={'space-between'}
                    textOverflow={'ellipsis'}
                >
                    <Text
                        height={10}
                        textOverflow={'ellipsis'}
                        width={'100%'}
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
                            <PlayCircle
                                r-else
                                onClick={async () => game.play()}
                            />
                        </React.Fragment>
                        <Download r-else />
                    </Flex>
                </BoxMotion>
            </BoxMotion>
            <Box
                r-if={game.isInstalled}
                position={'absolute'}
                top={-2}
                right={-2}
                bg={'green'}
                borderRadius={'50%'}
                height={6}
                width={6}
            >
                <Check />
            </Box>
        </Box>
    )
}

const BoxMotion = motion(Box)

export default observer(GameCard)
