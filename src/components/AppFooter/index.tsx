import React from 'react'
import styled from 'styled-components'
import Row from '../Row'
import Column from '../Column/index'
import { useTranslation } from 'react-i18next'
import { RowBetween, CenterRow } from '../Row/index'
import { FOOTER_LIST } from '../../constants/footerList'
import KccLogo from '../Logo/KccLogo'
import { useHistory } from 'react-router'
import { BrowserView, MobileView } from '../Common'
import MFooter from './MFooter'

export interface AppFooterProps {}

const AppFooterWrap = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
  height: 320px;
  background: #000;
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    tex-align: center;
  }
`
const AppFooterContentWrap = styled.div`
  width: 940px;
  padding-top: 43px;
  @media (max-width: 768px) {
    width: 100%;
    padding-top: 0px;
  }
`

const ChainText = styled.div`
  font-family: URWDIN-Regular;
  font-size: 20px;
  color: #0fcd8c;
  line-height: 32px;
  margin-top: 12px;
  width: 245px;
`
const FooterTitle = styled.span`
  font-family: URWDIN-Regular;
  font-size: 20px;
  color: #ffffff;
  line-height: 32px;
`

const FooterNavListWrap = styled(Column)`
  margin-top: 16px;
`

const FooterNavText = styled.span`
  font-family: URWDIN-Regular;
  font-size: 14px;
  color: #ffffff;
  line-height: 32px;
  cursor: pointer;
  &:hover {
    font-weight: bold;
  }
`

const CopyRightText = styled.div`
  margin-top: 40px;
  width: 100%;
  height: 60px;
  line-height: 60px;
  opacity: 0.6;
  font-family: URWDIN-Regular;
  font-size: 14px;
  color: #ffffff;
  border-top: 1px solid #fff;
  @media (max-width: 768px) {
    border-top: none;
    text-align: center;
    height: auto;
    font-size: 12px;
    margin-top: 0px;
  }
`

const AppFooter: React.FunctionComponent<AppFooterProps> = () => {
  const { t } = useTranslation()

  const router = useHistory()

  const nav2Target = (route: string | undefined) => {
    if (route) {
      if (route.startsWith('/')) {
        router.push(route)
      }
      if (route.startsWith('http')) {
        window.open(route, '_blank')
      }
    }
  }

  const FooterNavList = FOOTER_LIST.map((item, index) => {
    const children = item.children.map((nav, index) => {
      return (
        <FooterNavText key={index} onClick={nav2Target.bind(null, nav.navRoute)}>
          {t(nav.navText)}
        </FooterNavText>
      )
    })
    return (
      <Column key={index}>
        <FooterTitle>{t(item.title)}</FooterTitle>
        <FooterNavListWrap>{children}</FooterNavListWrap>
      </Column>
    )
  })

  return (
    <AppFooterWrap>
      <AppFooterContentWrap>
        <BrowserView>
          <Row>
            <CenterRow
              style={{
                width: '355px',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <KccLogo styles={{ width: '190px', textAlign: 'left', marginTop: '-20px' }} />
            </CenterRow>
            <RowBetween>{FooterNavList}</RowBetween>
          </Row>
        </BrowserView>
        <MobileView style={{ padding: '0 24px' }}>
          <MFooter />
        </MobileView>
        <CopyRightText>CopyRight © 2017 - {`${new Date().getFullYear()}`} kcc.io All Rights Reserved.</CopyRightText>
      </AppFooterContentWrap>
    </AppFooterWrap>
  )
}

export default AppFooter
