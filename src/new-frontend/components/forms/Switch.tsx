import React from 'react'
import { Switch as SwitchChakra } from '@chakra-ui/react'

const Switch: React.FC<{
    label: string
    value?: boolean
    onChange?: (val: boolean) => void
}> = ({ label, value, onChange }) => {
    return (
        <SwitchChakra
            size="md"
            checked={value}
            defaultChecked={value}
            onChange={(ev) => onChange?.(ev.target.checked)}
        >
            {label}
        </SwitchChakra>
    )
}

export default React.memo(Switch)
