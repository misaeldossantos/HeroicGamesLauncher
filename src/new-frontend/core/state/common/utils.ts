import { makeAutoObservable, reaction } from 'mobx'

export class StateBox<T> {
    constructor(private _val?: T) {
        makeAutoObservable(this)
    }

    set(val?: T) {
        this._val = val
    }

    get() {
        return this._val
    }

    is(...vals: T[]) {
        return !!vals.find((val) => this._val === val)
    }

    switch<O>(when: { [key: string]: O } & { default?: O }) {
        for (const val in when) {
            if (this.val === val) {
                return when[val]
            }
        }
        return when.default
    }

    setIf(is: T, val: T, otherwise?: T) {
        this.set(this.is(is) ? val : otherwise || this._val)
    }

    static create<T>(val: T) {
        return new StateBox(val)
    }

    get val() {
        return this._val
    }

    watch(fn: (val: T) => void) {
        return reaction(() => this.val!, fn)
    }
}

export class MobxState {
    disposers = new Set<() => void>()

    destroy() {
        for (const dispose of this.disposers) {
            dispose()
        }
    }

    addDisposer(disposer: () => void) {
        this.disposers.add(disposer)
    }
}

export class Disclosure<Props, ReturnData = void> {
    opened = false
    props?: Props

    private callback?: (data: ReturnData) => void

    constructor() {
        makeAutoObservable(this)
    }

    open(props: Props) {
        this.opened = true
        this.props = props
    }

    close() {
        this.opened = false
        this.props = undefined
    }

    async requestData(props: Props): Promise<ReturnData> {
        return new Promise((resolve) => {
            this.callback = resolve
            this.open(props)
        })
    }

    onReturn(data: ReturnData) {
        this.close()
        if (this.callback) {
            this.callback(data)
            this.callback = undefined
        }
    }
}
