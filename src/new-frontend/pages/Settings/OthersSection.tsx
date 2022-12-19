import React from 'react'
import { observer } from 'mobx-react'
import { Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import SectionTitle from './SectionTitle'
import FormField from '../../components/forms/FormField'
import Switch from '../../components/forms/Switch'

const OthersSection: React.FC<{}> = () => {
    const { t } = useTranslation()
    const settings = {}
    return (
        <Flex flexDirection={'column'} gap={8}>
            <SectionTitle title={t('settings.navbar.other')} />
            <FormField parent={settings} path={'esync'}>
                <Switch label={t('setting.esync', 'Enable Esync')} />
            </FormField>
            <FormField parent={settings} path={'fsync'}>
                <Switch label={t('setting.fsync', 'Enable Fsync')} />
            </FormField>
            <FormField parent={settings} path={'preferSystemLibs'}>
                <Switch
                    label={t(
                        'setting.preferSystemLibs',
                        'Prefer system libraries'
                    )}
                />
            </FormField>
            <FormField parent={settings} path={'enableFSR'}>
                <Switch
                    label={t(
                        'setting.enableFSRHack',
                        'Enable FSR Hack (Wine version needs to support it)'
                    )}
                />
            </FormField>
            <FormField parent={settings} path={'useGameMode'}>
                <Switch label={t('setting.gamemode')} />
            </FormField>
        </Flex>
    )
}

export default observer(OthersSection)
