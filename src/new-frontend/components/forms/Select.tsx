import React from 'react'
import { FormControl, FormLabel } from '@chakra-ui/react'
import { MenuPlacement, Select as ChackraSelect } from 'chakra-react-select'
import { get } from 'lodash'

const Select: React.FC<{
    label: string
    value?: any
    menuPlacement?: MenuPlacement
    options: any[]
    optionValue?: string
    onChange?: (val: any) => void
    optionLabel?: string
}> = ({
    onChange,
    label,
    options,
    optionLabel,
    optionValue,
    value,
    menuPlacement
}) => {
    const chakraStyles = {
        menuList: (provided) => ({
            ...provided,
            background: 'primary'
        }),
        menu: (provided) => ({
            ...provided,
            background: 'primary',
            zIndex: 1000
        }),
        option: (provided, state) => ({
            ...provided,
            background: state.isSelected
                ? 'accent'
                : state.isFocused
                ? 'gray.700'
                : 'primary',
            color: state.isSelected ? 'black' : 'white'
        })
    }
    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            <ChackraSelect
                menuPlacement={menuPlacement}
                focusBorderColor="accent"
                options={options}
                getOptionValue={
                    optionValue
                        ? (option) => get(option, optionValue)
                        : undefined
                }
                getOptionLabel={
                    optionLabel
                        ? (option) => get(option, optionLabel)
                        : undefined
                }
                value={
                    value
                        ? optionValue
                            ? get(value, optionValue)
                            : value
                        : value
                }
                chakraStyles={chakraStyles}
                onChange={(option) =>
                    onChange?.(optionValue ? get(option, optionValue) : option)
                }
            />
        </FormControl>
    )
}

export default Select
