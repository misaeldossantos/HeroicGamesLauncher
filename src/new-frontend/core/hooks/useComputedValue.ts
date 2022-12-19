import { useEffect, useMemo, useState } from 'react'
import useReaction from './useReaction'
import { debounce } from 'lodash'
import { autorun } from 'mobx'

export class SkipComputedChange {}

export default function useComputedValue<T>(fn: () => T, deps = []) {
    const [state, setState] = useState<T>()

    useEffect(() => {
        return autorun(() => {
            const onError = (e) => {
                if (!(e instanceof SkipComputedChange)) {
                    throw e
                }
            }
            try {
                const newVal = fn()
                if (newVal instanceof Promise) {
                    newVal.then(setState).catch(onError)
                } else {
                    setState(newVal)
                }
            } catch (e) {
                onError(e)
            }
        })
    }, deps)

    return state
}
