import React from 'react'
import { Text } from '@chakra-ui/react'

const ViewTab: React.FC<{
    title: string
    selected?: boolean
    onClick?: () => void
}> = ({ title, selected, onClick }) => {
    return (
        <Text
            onClick={onClick}
            cursor={'pointer'}
            px={10}
            pb={2}
            borderBottomColor={selected ? 'accent' : 'transparent'}
            borderBottomWidth={2}
            color={selected ? 'accent' : 'white'}
            fontWeight={selected ? 'bold' : 'normal'}
        >
            {title}
        </Text>
    )
}

export default ViewTab
