import React from 'react'
import FormField from '../forms/FormField'
import { useTranslation } from 'react-i18next'
import { observer } from 'mobx-react'
import FolderInput from '../forms/FolderInput'
import useGlobalStore from '../../core/hooks/useGlobalStore'
import Select from '../forms/Select'

const WineForm: React.FC<{ formObj: object }> = ({ formObj }) => {
    const { t } = useTranslation()
    const { wineVersions } = useGlobalStore()

    return (
        <>
            <FormField parent={formObj} path={'winePrefix'}>
                <FolderInput
                    label={t('setting.wineprefix')}
                    fileDialogTitle={t('box.wineprefix')}
                    help={t(
                        'infobox.wine-repfix.message',
                        'Wine uses what is called a WINEPREFIX to encapsulate Windows applications. ' +
                            'This prefix contains the Wine configuration files and a reproduction of the file hierarchy of C: ' +
                            '(the main disk on a Windows OS). In this reproduction of the C: drive, ' +
                            'your game save files and dependencies installed via winetricks are stored.'
                    )}
                />
            </FormField>
            <FormField parent={formObj} path={'wineVersion'}>
                <Select
                    label={t('setting.wineversion')}
                    options={wineVersions}
                    optionLabel={'name'}
                    menuPlacement={'top'}
                    optionValue={'bin'}
                />
            </FormField>
        </>
    )
}

export default observer(WineForm)
