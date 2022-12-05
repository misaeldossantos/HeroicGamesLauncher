import React from 'react'
import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    InputGroup,
    InputRightElement,
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@chakra-ui/react'
import { Input as ChakraInput } from '@chakra-ui/input'
import { Help } from '@mui/icons-material'

const Input: React.FC<{
    label: string
    right?: JSX.Element
    onChange?: (val: string) => void
    value?: string
    help?: string
}> = ({ label, right, help, value, onChange }) => {
    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            <Flex alignItems={'center'} gap={4}>
                <InputGroup>
                    <ChakraInput
                        value={value}
                        onChange={(ev) => onChange?.(ev.target.value)}
                    />
                    <InputRightElement px={6} r-if={right}>
                        {right}
                    </InputRightElement>
                </InputGroup>
                <Popover r-if={help}>
                    <PopoverTrigger>
                        <Box cursor={'pointer'}>
                            <Help />
                        </Box>
                    </PopoverTrigger>
                    <PopoverContent p={2} mr={10} borderColor={'gray'}>
                        {help}
                    </PopoverContent>
                </Popover>
            </Flex>
        </FormControl>
    )
}

export default Input
