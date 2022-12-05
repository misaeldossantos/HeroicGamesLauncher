import { GlobalStore } from '../core/state/global/GlobalStore'

const globalStore = new GlobalStore()

export default function useGlobalStore() {
    return globalStore
}
