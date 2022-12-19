import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import WebviewControls from './WebviewControls'
import { WebviewType } from 'common/types'
import './index.css'
import LoginWarning from './LoginWarning'
import Modal from '../../components/ui/Modal'
import useGlobalStore from '../../core/hooks/useGlobalStore'
import { observer } from 'mobx-react'
import { Box, Flex, Grid } from '@chakra-ui/react'

type CODE = {
    authorizationCode: string
}

const LoginInWebviewModal = () => {
    const { i18n } = useTranslation()

    const {
        mainPage: { loginModal },
        stores: { epic, gog }
    } = useGlobalStore()

    const webviewRef = useRef<WebviewType>(null)

    const epicLoginUrl = 'https://legendary.gl/epiclogin'

    const gogEmbedRegExp = new RegExp('https://embed.gog.com/on_login_success?')
    const gogLoginUrl =
        'https://auth.gog.com/auth?client_id=46899977096215655&redirect_uri=https%3A%2F%2Fembed.gog.com%2Fon_login_success%3Forigin%3Dclient&response_type=code&layout=galaxy'

    const trueAsStr = 'true' as unknown as boolean | undefined
    const runner = loginModal.props?.store

    const startUrl =
        loginModal.props?.store === 'epic' ? epicLoginUrl : gogLoginUrl

    useLayoutEffect(() => {
        if (!loginModal.opened) {
            return
        }
        const webview = webviewRef.current
        if (webview) {
            const loadstop = () => {
                // Ignore the login handling if not on login page
                if (!runner) {
                    return
                } else if (runner === 'gog') {
                    const pageUrl = webview.getURL()
                    if (pageUrl?.match(gogEmbedRegExp)) {
                        const parsedURL = new URL(pageUrl)
                        const code = parsedURL.searchParams.get('code')
                        if (code) {
                            gog.auth(code).then(() => {
                                loginModal.close()
                            })
                        }
                    }
                } else {
                    webview.addEventListener('did-navigate', async () => {
                        webview.focus()

                        setTimeout(() => {
                            webview.findInPage('authorizationCode')
                        }, 50)
                        webview.addEventListener('found-in-page', async () => {
                            webview.focus()
                            webview.selectAll()
                            webview.copy()

                            setTimeout(async () => {
                                const text =
                                    await window.api.clipboardReadText()
                                const { authorizationCode }: CODE =
                                    JSON.parse(text)

                                try {
                                    await epic.auth(authorizationCode)
                                    loginModal.close()
                                } catch (error) {
                                    console.error(error)
                                    window.api.logError(String(error))
                                }
                            }, 200)
                        })
                    })
                }
            }

            webview.addEventListener('dom-ready', loadstop)

            return () => {
                webview.removeEventListener('dom-ready', loadstop)
            }
        }
        return
    }, [loginModal.opened, webviewRef.current])

    const [showLoginWarningFor, setShowLoginWarningFor] = useState<
        null | 'epic' | 'gog'
    >(null)

    useEffect(() => {
        if (!loginModal.opened) {
            return
        }
        if (startUrl?.match(/epicgames\.com/)) {
            setShowLoginWarningFor('epic')
        } else if (
            startUrl?.match(/gog\.com/) &&
            !startUrl.match(/auth\.gog\.com/)
        ) {
            setShowLoginWarningFor('gog')
        }
    }, [loginModal.opened, startUrl])

    const onLoginWarningClosed = () => {
        setShowLoginWarningFor(null)
    }

    return (
        <Modal modal={loginModal} title={'Login'} noAnimation>
            <Grid templateRows={'auto 1fr'} height={'100%'}>
                <WebviewControls
                    webview={webviewRef.current}
                    initURL={startUrl}
                    openInBrowser={!startUrl.startsWith('login')}
                />
                <Box flex={1} position={'relative'}>
                    <Flex
                        flex={1}
                        flexDir={'column'}
                        position={'absolute'}
                        inset={0}
                    >
                        <webview
                            style={{ height: '100%' }}
                            ref={webviewRef}
                            partition="persist:epicstore"
                            src={startUrl}
                            allowpopups={trueAsStr}
                            useragent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) old-airport-include/1.0.0 Chrome Electron/7.1.7 Safari/537.36"
                        />
                        <LoginWarning
                            r-if={showLoginWarningFor}
                            warnLoginForStore={showLoginWarningFor}
                            onClose={onLoginWarningClosed}
                        />
                    </Flex>
                </Box>
            </Grid>
        </Modal>
    )
}

export default observer(LoginInWebviewModal)
