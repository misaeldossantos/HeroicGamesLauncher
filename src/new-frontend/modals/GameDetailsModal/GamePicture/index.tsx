import React from 'react'
import CachedImage from 'new-frontend/components/ui/CachedImage'

import fallbackImage from 'new-frontend/assets/heroic_card.jpg'

type Props = {
    art_square: string
    imgStyle?: object
    store: string
}

function GamePicture({ art_square, store, imgStyle, ...props }: Props) {
    function getImageFormatting() {
        if (art_square === 'fallback' || !art_square)
            return { src: fallbackImage, fallback: fallbackImage }
        if (store === 'legendary') {
            return {
                src: `${art_square}?h=800&resize=1&w=600`,
                fallback: `${art_square}?h=400&resize=1&w=300`
            }
        } else {
            return { src: art_square, fallback: 'fallback' }
        }
    }

    const { src, fallback } = getImageFormatting()

    return (
        <CachedImage
            draggable={false}
            alt="cover-art"
            className="gameImg"
            src={src}
            fallback={fallback}
            style={imgStyle}
        />
    )
}

export default GamePicture
