import { GlobalStore } from '../state/global/GlobalStore'

const globalStore = new GlobalStore()

export default function useGlobalStore() {
    return globalStore
}
