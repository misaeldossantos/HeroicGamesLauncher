import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flex } from '@chakra-ui/react'

interface LogBoxProps {
    logFileContent: string
}

const LogBox: React.FC<LogBoxProps> = ({ logFileContent }) => {
    const { t } = useTranslation()
    const maxLines = 1000
    let sliced = false
    let lines = logFileContent.split('\n')
    if (lines.length > maxLines) {
        lines = ['...', ...lines.slice(-maxLines)]
        sliced = true
    }

    return (
        <>
            {sliced && (
                <span className="setting long-log-hint">
                    {t(
                        'settings.log.long-log-hint',
                        'Log truncated, last 1000 lines are shown!'
                    )}
                </span>
            )}
            <span className="setting log-box">
                {lines.map((line, key) => {
                    if (line.toLowerCase().includes(' err')) {
                        return (
                            <p key={key} className="log-error">
                                {line}
                            </p>
                        )
                    } else if (line.toLowerCase().includes(' warn')) {
                        return (
                            <p key={key} className="log-warning">
                                {line}
                            </p>
                        )
                    } else {
                        return (
                            <p key={key} className="log-info">
                                {line}
                            </p>
                        )
                    }
                })}
            </span>
        </>
    )
}

export default React.memo(LogBox)
