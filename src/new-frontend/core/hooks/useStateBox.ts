import { useMemo } from 'react'
import { StateBox } from '../state/common/utils'

export default function useStateBox<T>(val?: T | (() => T)) {
    return useMemo(
        () =>
            StateBox.create(
                (typeof val === 'function' ? (val as () => T)() : val) as T
            ),
        []
    )
}
