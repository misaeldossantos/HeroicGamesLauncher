import React from 'react'
import { observer } from 'mobx-react'
import { Flex } from '@chakra-ui/react'
// import { useTranslation } from 'react-i18next'
import SectionTitle from './SectionTitle'
import WineForm from '../../components/settings/WineForm'

const WineSection: React.FC<{}> = ({}) => {
    // const { t } = useTranslation()
    return (
        <Flex flexDirection={'column'} gap={3}>
            <SectionTitle title={'Wine'} />
            <WineForm formObj={{}} />
        </Flex>
    )
}

export default observer(WineSection)
