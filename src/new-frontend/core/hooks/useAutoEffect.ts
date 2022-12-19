import { useEffect } from 'react'
import { autorun } from 'mobx'

export default function useAutoEffect(fn, deps = []) {
    return useEffect(() => autorun(fn), deps)
}
