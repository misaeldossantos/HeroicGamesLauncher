import React from 'react'
import { AnimatePresence } from 'framer-motion'
import MotionBox from './MotionBox'
import chroma from 'chroma-js'
import { Flex, Grid, Text } from '@chakra-ui/react'
import { Close } from '@mui/icons-material'
import useGlobalStore from '../../hooks/useGlobalStore'
import { Disclosure } from '../../core/state/common/utils'
import { observer } from 'mobx-react'

const Modal: React.FC<{
    modal: Disclosure<unknown>
    title: string
    modalKey?: string
    menu?: JSX.Element
    children: JSX.Element[] | JSX.Element
}> = ({ modalKey, modal, children, title, menu }) => {
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
                    bg={chroma(layoutPreferences.primaryColor.val!)
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
                pointerEvents={modal.opened ? 'auto' : 'none'}
                overflow={'hidden'}
            >
                <AnimatePresence>
                    <MotionBox
                        key={modalKey}
                        layoutId={modalKey}
                        r-if={modal.opened}
                        zIndex={1000}
                        bg={'surface'}
                        height={'90%'}
                        color={'white'}
                        width={'70%'}
                        initial={{ bottom: -3000, scale: 1.5 }}
                        exit={{ bottom: 3000, scale: 0.2 }}
                        animate={{ bottom: 0, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        borderRadius={10}
                        overflowY={'auto'}
                        border={'2px solid gray'}
                        position={'relative'}
                    >
                        <Grid gridTemplateRows={'auto 1fr'} height={'100%'}>
                            <Flex
                                flexDirection={'row'}
                                alignItems={'center'}
                                p={5}
                                bg={'surface'}
                                zIndex={1000}
                                gap={5}
                            >
                                <Text fontSize={20}>{title}</Text>
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
