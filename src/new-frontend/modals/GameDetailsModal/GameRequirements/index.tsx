import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Reqs } from 'common/types'

import './index.css'
import { observer } from 'mobx-react'

const GameRequirements: React.FC<{ requirements: Reqs[] }> = ({
    requirements
}) => {
    const { t } = useTranslation('gamepage')

    return (
        <div className="gameRequirements">
            <table>
                <tbody>
                    <tr>
                        <td className="specs"></td>
                        <td className="specs">
                            {t('specs.minimum').toUpperCase()}
                        </td>
                        <td className="specs">
                            {t('specs.recommended').toUpperCase()}
                        </td>
                    </tr>
                    {requirements.map(
                        (e) =>
                            e &&
                            e.title && (
                                <Fragment key={e.title}>
                                    <tr>
                                        <td>
                                            <span className="title">
                                                {e.title.toUpperCase()}:
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text">
                                                {e.minimum}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text">
                                                {e.recommended}
                                            </span>
                                        </td>
                                    </tr>
                                </Fragment>
                            )
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default observer(GameRequirements)
