import React from 'react'
import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react'
import { useTranslation } from 'react-i18next'
import { languageLabels } from '../../../core/state/settings/languages'
import useGlobalStore from '../../../core/hooks/useGlobalStore'
import SectionTitle from '../SectionTitle'
import Switch from '../../../components/forms/Switch'
import Select from '../../../components/forms/Select'

const languageOptions = Object.keys(languageLabels).map((key) => {
    return {
        value: key,
        label: languageLabels[key]
    }
})

const Interface = () => {
    const { t } = useTranslation()
    const { settings } = useGlobalStore()

    return (
        <Flex gap={10} flexDirection={'column'}>
            <SectionTitle title={t('settings.interface', 'Interface')} />
            <Select
                label={t('setting.language', 'Choose App Language')}
                options={languageOptions}
                optionValue={'value'}
                optionLabel={'label'}
                onChange={(option) => option && settings.setLanguage(option)}
            />
            <Switch label={'Efeitos sonoros'} />
        </Flex>
    )
}

export default observer(Interface)
