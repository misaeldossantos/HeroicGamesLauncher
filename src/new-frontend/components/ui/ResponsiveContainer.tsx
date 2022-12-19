import React from 'react'
import { Box, BoxProps } from '@chakra-ui/react'

const ResponsiveContainer: React.FC<BoxProps> = ({ children, ...props }) => {
    return (
        <Box maxW={1500} margin={'0 auto'} {...props}>
            {children}
        </Box>
    )
}

export default ResponsiveContainer
