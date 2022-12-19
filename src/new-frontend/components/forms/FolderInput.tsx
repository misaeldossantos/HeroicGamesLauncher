import React from 'react'
import Input, { InputProps } from './Input'
import { Folder } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

const FolderInput: React.FC<
    InputProps & { fileDialogTitle: string; appendNewFolder?: string }
> = ({ fileDialogTitle, appendNewFolder, ...props }) => {
    const { t } = useTranslation()

    return (
        <Input
            {...props}
            right={
                <Folder
                    onClick={() => {
                        if (!props.onChange) return
                        window.api
                            .openDialog({
                                buttonLabel: t('box.choose'),
                                properties: ['openDirectory'],
                                title: fileDialogTitle,
                                defaultPath: props.value
                            })
                            .then((path) => {
                                if (path) {
                                    props.onChange!(
                                        path +
                                            (appendNewFolder
                                                ? `/${appendNewFolder}`
                                                : '')
                                    )
                                }
                            })
                    }}
                />
            }
        />
    )
}

export default FolderInput
