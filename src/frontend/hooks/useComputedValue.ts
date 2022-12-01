import { useMemo, useState } from 'react'
import useReaction from './useReaction'
import { debounce } from 'lodash'

export default function useComputedValue<T>(
  fn: () => T,
  deps = [],
  { debounceTime }: { debounceTime?: number } = {}
) {
  const [state, setState] = useState<T>(fn)

  useReaction(
    {
      observer: fn,
      fn: useMemo(
        () => (debounceTime ? debounce(setState, debounceTime) : setState),
        []
      ),
      options: {
        fireImmediately: true
      }
    },
    deps
  )

  return state
}
