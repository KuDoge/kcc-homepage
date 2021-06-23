import { Button } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { BaseWrap, HomePageWrap } from '../home/index'
import Card from '../../components/ActivityCard'

export interface GrantsPageProps {}

const ActivitiesPageWrap = styled(HomePageWrap)`
  padding-top: 40px;
  padding-bottom: 40px;
  height: auto;
  background: linear-gradient(0deg, #277453 0%, rgba(0, 0, 0, 1) 100%);
`
const ContentWrap = styled(BaseWrap)`
  margin-top: 68px;
  @media (max-width: 768px) {
    padding: 0 24px;
  }
`

const ListWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  grid-column-gap: 50px;
  grid-row-gap: 50px;
  margin-top: 24px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(
      ${() => {
        const width = document.body.clientWidth
        return Math.floor(width / 300)
      }},
      1fr
    );
    justify-items: center;
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    grid-template-columns: repeat(
      ${() => {
        const width = document.body.clientWidth
        return Math.floor(width / 300)
      }},
      1fr
    );
    justify-items: center;
  }
`

const Title = styled.div`
  height: 32px;
  font-size: 32px;
  font-family: URWDIN-Medium, URWDIN;
  font-weight: 500;
  color: #fff;
  line-height: 38px;
  @media (max-width: 768px) {
    font-size: 24px;
  }
`
const SubTitle = styled.div`
  height: 32px;
  font-size: 20px;
  font-family: URWDIN-Regular, URWDIN;
  font-weight: 400;
  color: #fff;
  line-height: 32px;
  @media (max-width: 768px) {
    font-size: 18px;
  }
`

const ActivityWrap = styled.div`
  width: 280px;
  height: 208px;
  background: #f1f4f7;
  border-radius: 6px;
`

const ActivityImaga = styled.img`
  width: 280px;
  height: 208px;
  background: #f1f4f7;
  border-radius: 6px;
`

const ActivitiesPage: React.FunctionComponent<GrantsPageProps> = () => {
  const activities = [
    {
      id: 0,
      thumbnail: '',
      title: 'KCC生态联盟',
      deadline: '2021-06-07 10:57:33',
      content: '',
      valid: true,
    },
    {
      id: 0,
      thumbnail: '',
      title: 'KCC生态联盟',
      deadline: '2021-06-07 10:57:33',
      content: '',
      valid: true,
    },
    {
      id: 0,
      thumbnail: '',
      title: 'KCC生态联盟',
      deadline: '2021-06-07 10:57:33',
      content: '',
      valid: true,
    },
    {
      id: 0,
      thumbnail: '',
      title: 'KCC生态联盟',
      deadline: '2021-06-07 10:57:33',
      content: '',
      valid: true,
    },
    {
      id: 0,
      thumbnail: '',
      title: 'KCC生态联盟',
      deadline: '2021-06-07 10:57:33',
      content: '',
      valid: true,
    },
  ]

  const endList = [
    {
      id: 0,
      thumbnail: '',
      title: 'KCC生态联盟',
      deadline: '2021-06-07 10:57:33',
      content: '',
      valid: false,
    },
    {
      id: 0,
      thumbnail: '',
      title: 'KCC生态联盟',
      deadline: '2021-06-07 10:57:33',
      content: '',
      valid: false,
    },
  ]

  const { t } = useTranslation()

  const ActivityList = activities.map((item, index) => {
    return <Card key={index} {...item} />
  })

  const overList = endList.map((item, index) => {
    return <Card key={index} {...item} />
  })

  return (
    <ActivitiesPageWrap>
      {/* banner */}
      <ContentWrap>
        <Title>{t(`KCC Activities`)}</Title>
        <SubTitle>{t(`In Progress`)}</SubTitle>
        <ListWrap>{ActivityList}</ListWrap>
      </ContentWrap>
      <ContentWrap>
        <SubTitle>{t(`The Event Is Over`)}</SubTitle>
        <ListWrap>{overList}</ListWrap>
      </ContentWrap>
    </ActivitiesPageWrap>
  )
}

export default ActivitiesPage
