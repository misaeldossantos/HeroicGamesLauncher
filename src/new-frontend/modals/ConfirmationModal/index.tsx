import React from 'react'
import useGlobalStore from '../../core/hooks/useGlobalStore'
import { observer } from 'mobx-react'
import Modal from '../../components/ui/Modal'
import { Button, Flex, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

const ConfirmationModal = () => {
    const { confirmationModal } = useGlobalStore()

    const { t } = useTranslation()

    return (
        <Modal
            modal={confirmationModal}
            title={t('confirmation.confirm', 'Confirm')}
            height={'auto'}
            minHeight={0}
            noAnimation
            minWidth={0}
            width={600}
        >
            <Flex flexDirection={'column'} px={5} pb={5} gap={4}>
                <Text>{confirmationModal.props?.message}</Text>
                <Flex gap={3} alignSelf={'flex-end'}>
                    <Button
                        onClick={() => confirmationModal.onReturn(false)}
                        variant={'ghost'}
                    >
                        {t('confirmation.no', 'No')}
                    </Button>
                    <Button
                        onClick={() => confirmationModal.onReturn(true)}
                        variant={'outline'}
                    >
                        {t('confirmation.yes', 'Yes')}
                    </Button>
                </Flex>
            </Flex>
        </Modal>
    )
}

export default observer(ConfirmationModal)
