import { HowLongToBeatEntry } from 'howlongtobeat'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from '@chakra-ui/react'

type Props = {
    howLongToBeatInfo: HowLongToBeatEntry
}

const HowLongToBeat = ({ howLongToBeatInfo }: Props) => {
    const { t } = useTranslation('gamepage')

    const { gameplayMain, gameplayMainExtra, gameplayCompletionist } =
        howLongToBeatInfo

    return (
        <Flex flexDirection={'column'} gap={4}>
            <Text fontSize={20} fontWeight={'bold'}>
                {t('howLongToBeat', 'How long to beat')}
            </Text>
            <Flex flexDirection={'row'} gap={5}>
                <InfoBox title={t('how-long-to-beat.main-story', 'Main Story')}>
                    {gameplayMain || '?'} {t('hours', 'Hours')}
                </InfoBox>
                <InfoBox
                    title={t(
                        'how-long-to-beat.main-plus-extras',
                        'Main + Extras'
                    )}
                >
                    {gameplayMainExtra || '?'} {t('hours', 'Hours')}
                </InfoBox>
                <InfoBox
                    title={t('how-long-to-beat.completionist', 'Completionist')}
                >
                    {gameplayCompletionist || '?'} {t('hours', 'Hours')}
                </InfoBox>
            </Flex>
        </Flex>
    )
}

const InfoBox: React.FC<{ title: string; children: unknown }> = ({
    title,
    children
}) => {
    return (
        <Flex
            flexDirection={'column'}
            gap={1}
            bg={'#383838'}
            borderRadius={5}
            width={150}
            p={4}
            alignItems={'center'}
            border={'1px solid gray'}
            textAlign={'center'}
        >
            <Text>{title}</Text>
            <Text fontWeight={'bold'} fontSize={18}>
                {children as string}
            </Text>
        </Flex>
    )
}

export default React.memo(HowLongToBeat)
