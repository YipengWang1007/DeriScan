import Skeleton from 'react-loading-skeleton'

import TradeRanks from '@/components/trade_ranks'
import {Main} from '@/components/main'
import {Header} from '@/components/header'

import { useTradeRanks } from '@/lib/swr-hooks'

export default function IndexPage() {
  const { tradeRanks, isLoading } = useTradeRanks()

  if (isLoading) {
    return (
    <>
    <Header>
     Trade Rank
    </Header>
    <Main>
      <Skeleton count={5}/>
    </Main>
    </>
    )
  }

  return (
    <>
    <Header>
     Trade Rank
    </Header>
    <Main>
      <TradeRanks tradeRanks={tradeRanks} />
    </Main>
    </>
    )
}
