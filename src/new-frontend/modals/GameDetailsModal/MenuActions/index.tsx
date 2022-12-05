import React from 'react'
import { Game } from '../../../core/state/model/Game'
import { useTranslation } from 'react-i18next'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { MoreHoriz } from '@mui/icons-material'
import { observer } from 'mobx-react'

const MenuActions: React.FC<{ game: Game }> = ({ game }) => {
    const { t } = useTranslation('gamepage', {})
    return (
        <Menu r-if={game}>
            <MenuButton as={MoreHoriz}></MenuButton>
            <MenuList zIndex={1000}>
                <MenuItem r-if={game!.hasShortcuts}>
                    {t('submenu.removeShortcut', 'Remove shortcuts')}
                </MenuItem>
                <MenuItem r-else>
                    {t('submenu.addShortcut', 'Add shortcut')}
                </MenuItem>
                <MenuItem r-if={game!.addedToSteam}>
                    {t('submenu.removeFromSteam', 'Remove from Steam')}
                </MenuItem>
                <MenuItem r-else>
                    {t('submenu.addToSteam', 'Add to Steam')}
                </MenuItem>
                <MenuItem>{t('button.uninstall', 'Uninstall')}</MenuItem>
                <MenuItem>
                    {t('button.force_update', 'Force Update if Available')}
                </MenuItem>
                <MenuItem>{t('submenu.move')}</MenuItem>
                <MenuItem>{t('submenu.change')}</MenuItem>
                <MenuItem>{t('submenu.store')}</MenuItem>
                <MenuItem>{t('submenu.protondb')}</MenuItem>
            </MenuList>
        </Menu>
    )
}

export default observer(MenuActions)
