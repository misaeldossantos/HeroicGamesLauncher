import React from 'react'
import { motion, MotionProps } from 'framer-motion'
import { Box, BoxProps } from '@chakra-ui/react'

const MotionBox: React.FC<Omit<BoxProps, 'transition'> & MotionProps> =
    motion(Box)
export default MotionBox
