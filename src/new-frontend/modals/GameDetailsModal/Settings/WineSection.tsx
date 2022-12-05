import React from 'react'
import { observer } from 'mobx-react'
import { Game } from '../../../core/state/model/Game'
import { Flex } from '@chakra-ui/react'
import { Folder } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import SectionTitle from './SectionTitle'
import Input from '../../../components/forms/Input'
import FormField from '../../../components/forms/FormField'
import { runInAction } from 'mobx'

const WineSection: React.FC<{ game: Game }> = ({ game }) => {
    const { t } = useTranslation()
    return (
        <Flex flexDirection={'column'} gap={3}>
            <SectionTitle title={'Wine'} />
            <FormField parent={game.settings} path={'winePrefix'}>
                <Input
                    label={t('setting.wineprefix')}
                    right={
                        <Folder
                            onClick={() => {
                                window.api
                                    .openDialog({
                                        buttonLabel: t('box.choose'),
                                        properties: ['openDirectory'],
                                        title: t('box.wineprefix'),
                                        defaultPath: game.settings.winePrefix
                                    })
                                    .then((path) => {
                                        runInAction(() => {
                                            game.settings.winePrefix =
                                                path || game.settings.winePrefix
                                        })
                                    })
                            }}
                        />
                    }
                    help={t(
                        'infobox.wine-repfix.message',
                        'Wine uses what is called a WINEPREFIX to encapsulate Windows applications. ' +
                            'This prefix contains the Wine configuration files and a reproduction of the file hierarchy of C: ' +
                            '(the main disk on a Windows OS). In this reproduction of the C: drive, ' +
                            'your game save files and dependencies installed via winetricks are stored.'
                    )}
                />
            </FormField>
        </Flex>
    )
}

export default observer(WineSection)
