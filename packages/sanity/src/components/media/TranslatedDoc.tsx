import {Flex, Text} from '@sanity/ui'
import React from 'react'
import styled from 'styled-components'

const SquareFlex = styled(Flex)`
  width: 100%;
  aspect-ratio: 1/1;
  position: relative;
  overflow: hidden;
  border: none;

  & div {
    z-index: 5;
    position: absolute;
    bottom: 3px;
    right: 2px;
  }

  + span {
    box-shadow: none !important;
  }
`

type TranslatedDocType = {
  icon: React.ReactNode
  languageIcon?: React.ReactNode
}

export default function TranslatedDoc(props: TranslatedDocType) {
  const {icon, languageIcon} = props

  return (
    <SquareFlex align="center" justify="center">
      {icon}
      {languageIcon && <Text size={2}>{languageIcon}</Text>}
    </SquareFlex>
  )
}
