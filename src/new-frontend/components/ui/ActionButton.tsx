import React from 'react'
import MotionBox from './MotionBox'
import { Flex, Spinner, Text } from '@chakra-ui/react'

const ActionButton: React.FC<{
    onClick: () => void
    color: string
    label: string
    loading?: boolean
    icon?: JSX.Element
    textColor?: string
}> = ({ onClick, color, textColor, icon, label, loading }) => {
    return (
        <MotionBox
            whileTap={{
                y: 4
            }}
            onClick={onClick}
        >
            <Flex
                bg={color}
                color={textColor}
                p={3}
                borderRadius={6}
                gap={2}
                alignItems={'center'}
                cursor={'pointer'}
                as={'button'}
                height={50}
                width={250}
                justifyContent={'center'}
            >
                <Spinner r-if={loading} />
                <React.Fragment r-else>
                    {icon}
                    <Text
                        fontSize={16}
                        fontWeight={'bold'}
                        textTransform={'uppercase'}
                    >
                        {label}
                    </Text>
                </React.Fragment>
            </Flex>
        </MotionBox>
    )
}

export default ActionButton
