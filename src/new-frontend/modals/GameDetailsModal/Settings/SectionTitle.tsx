import React from 'react'
import { Flex, Text } from '@chakra-ui/react'

const SectionTitle: React.FC<{ title: string }> = ({ title }) => {
    return (
        <Flex flexDirection={'row'} alignItems={'center'} gap={5}>
            <Text fontSize={20} color={'accent'} fontWeight={'bold'}>
                {title}
            </Text>
            <Flex flex={1} height={0.1} bg={'gray'} />
        </Flex>
    )
}

export default React.memo(SectionTitle)
