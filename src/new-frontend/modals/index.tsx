import React from 'react'
import GameDetailsModal from './GameDetailsModal'
import RequestDownloadModal from './RequestDownloadModal'
import useGlobalStore from '../core/hooks/useGlobalStore'
import LoginInWebviewModal from './LoginInWebviewModal'
import ConfirmationModal from './ConfirmationModal'

const Modals = () => {
    const {
        mainPage: { requestDownloadModal }
    } = useGlobalStore()
    return (
        <>
            <GameDetailsModal />
            <RequestDownloadModal modal={requestDownloadModal} />
            <LoginInWebviewModal />
            <ConfirmationModal />
        </>
    )
}

export default Modals
