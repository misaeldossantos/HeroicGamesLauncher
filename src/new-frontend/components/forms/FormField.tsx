import React, { useCallback } from 'react'
import { observer } from 'mobx-react'
import { get, set } from 'lodash'
import { runInAction } from 'mobx'

const FormField: React.FC<{
    path: string
    parent: object
    children: JSX.Element
}> = ({ path, parent, children }) => {
    return React.cloneElement(React.Children.only(children), {
        value: get(parent, path),
        onChange: useCallback((val: never) => {
            runInAction(() => {
                set(parent, path, val)
            })
        }, [])
    })
}

export default observer(FormField)
