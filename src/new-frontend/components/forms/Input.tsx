import React, { Ref } from 'react'
import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    InputGroup,
    InputRightElement,
    Popover,
    PopoverContent,
    InputProps as ChackraInputProps,
    PopoverTrigger,
    InputLeftElement
} from '@chakra-ui/react'
import { Input as ChakraInput } from '@chakra-ui/input'
import { Help } from '@mui/icons-material'

export type InputProps = Omit<
    ChackraInputProps,
    'left' | 'right' | 'onChange'
> & {
    label?: string
    right?: JSX.Element
    left?: JSX.Element
    onChange?: (val: string) => void
    inputRef?: Ref<HTMLInputElement>
    value?: string
    help?: string
}

const Input: React.FC<InputProps> = ({
    label,
    left,
    right,
    help,
    value,
    inputRef,
    onChange,
    ...props
}) => {
    return (
        <FormControl>
            <FormLabel r-if={label}>{label}</FormLabel>
            <Flex alignItems={'center'} gap={4}>
                <InputGroup>
                    <InputLeftElement px={6} r-if={left}>
                        {left}
                    </InputLeftElement>
                    <ChakraInput
                        ref={inputRef}
                        focusBorderColor="accent"
                        value={value}
                        onChange={(ev) => onChange?.(ev.target.value)}
                        {...props}
                    />
                    <InputRightElement px={6} r-if={right}>
                        {right}
                    </InputRightElement>
                </InputGroup>
                <Popover r-if={help} placement={'left'}>
                    <PopoverTrigger>
                        <Box cursor={'pointer'}>
                            <Help />
                        </Box>
                    </PopoverTrigger>
                    <PopoverContent bg={'primary'} p={2} borderColor={'gray'}>
                        {help}
                    </PopoverContent>
                </Popover>
            </Flex>
        </FormControl>
    )
}

export default Input
