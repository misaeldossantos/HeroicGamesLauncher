import React from 'react'
import { AnimatePresence } from 'framer-motion'
import MotionBox from './MotionBox'
import chroma from 'chroma-js'
import { Flex, Grid, Text } from '@chakra-ui/react'
import { Close } from '@mui/icons-material'
import useGlobalStore from '../../core/hooks/useGlobalStore'
import { Disclosure } from '../../core/state/common/utils'
import { observer } from 'mobx-react'

const Modal: React.FC<{
    modal: Disclosure<any, any>
    title: string
    modalKey?: string
    menu?: JSX.Element
    noAnimation?: boolean
    width?: number | string
    minWidth?: number | string
    minHeight?: number | string
    fullScreen?: boolean
    height?: number | string
    children: JSX.Element[] | JSX.Element
}> = ({
    fullScreen,
    modalKey,
    modal,
    children,
    title,
    noAnimation,
    menu,
    height = '90%',
    minHeight = 700,
    minWidth = 1000,
    width = '70%'
}) => {
    const { layoutPreferences } = useGlobalStore()
    return (
        <>
            <AnimatePresence>
                <MotionBox
                    r-if={modal.opened}
                    display={'flex'}
                    position={'absolute'}
                    inset={0}
                    zIndex={1000}
                    bg={chroma(layoutPreferences.themeColors.primary)
                        .alpha(0.1)
                        .css()}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1
                    }}
                    exit={{
                        opacity: 0
                    }}
                    overflow={'hidden'}
                    boxShadow={'0 4px 30px rgba(0, 0, 0, 0.1)'}
                    backdropFilter={'blur(6px)'}
                />
            </AnimatePresence>
            <Flex
                position={'absolute'}
                inset={0}
                alignItems={'center'}
                justifyContent={'center'}
                overflow={'hidden'}
                pointerEvents={modal.opened ? 'auto' : 'none'}
            >
                <AnimatePresence>
                    <MotionBox
                        key={modalKey}
                        layoutId={modalKey}
                        r-if={modal.opened}
                        zIndex={1000}
                        bg={'surface'}
                        color={'white'}
                        minWidth={minWidth}
                        minHeight={minHeight}
                        width={fullScreen ? '100%' : width}
                        height={fullScreen ? '100%' : height}
                        transition={{ duration: 0.8 }}
                        initial={
                            noAnimation ? {} : { bottom: -3000, scale: 1.5 }
                        }
                        exit={noAnimation ? {} : { bottom: 3000, scale: 0.2 }}
                        animate={noAnimation ? {} : { bottom: 0, scale: 1 }}
                        borderRadius={fullScreen ? 0 : 10}
                        overflowY={'auto'}
                        borderWidth={2}
                        borderColor={'text'}
                        position={'relative'}
                    >
                        <Grid
                            gridTemplateRows={'auto 1fr'}
                            height={'100%'}
                            position={'relative'}
                        >
                            <Flex
                                flexDirection={'row'}
                                alignItems={'center'}
                                p={5}
                                bg={'surface'}
                                zIndex={1000}
                                gap={5}
                            >
                                <Text fontSize={20} fontWeight={'bold'}>
                                    {title}
                                </Text>
                                <Flex flex={1} />
                                {menu}
                                <Close onClick={() => modal.close()} />
                            </Flex>
                            {children}
                        </Grid>
                    </MotionBox>
                </AnimatePresence>
            </Flex>
        </>
    )
}

export default observer(Modal)
