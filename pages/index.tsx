import Skeleton from 'react-loading-skeleton'

import Home from '@/components/home'
import {Main} from '@/components/main'
import {Header} from '@/components/header'
import {SubLayout, SubTitle} from '@/components/shared'

import { useHomeCount } from '@/lib/swr-hooks'
import { getPoolConfigList, DeriEnv} from '@/lib/derijs/config'
import { perpetualPoolV2Factory } from '@/lib/derijs/factory'
import { bg } from '@/lib/derijs/utils'
import { ISymbol, IBToken} from '@/lib/derijs/perpetual_pool_v2'

import {useState, useEffect} from 'react'

export default function IndexPage() {
  const { data, isLoading } = useHomeCount()
  const [ pools, updatePools ] = useState([]);

   useEffect(() => {

    const fetchPoolsInfo = async () => {
      DeriEnv.set('prod')
      let poolsInfo = getPoolConfigList(DeriEnv.get())
      // for pools[0]
      const pool = poolsInfo[0]
      const perpetualPool = perpetualPoolV2Factory(pool.chainId, pool.pool)
      const liquidities = (await Promise.all<IBToken>(pool.bTokens.map((b) => perpetualPool.getBToken(b.bTokenId)))).map(b => bg(b.liquidity).toFixed(2).toString())
      const tradersNetVolumes = (await Promise.all<ISymbol>(pool.symbols.map((s) => perpetualPool.getSymbol(s.symbolId)))).map(s => bg(s.tradersNetVolume).toFixed(2).toString())
      poolsInfo[0].liquidities = liquidities
      poolsInfo[0].tradersNetVolumes= tradersNetVolumes

      //console.log('useEffect', poolsInfo)
      updatePools(poolsInfo)
    }

    fetchPoolsInfo()
  }, [])

  const header = (
    <Header>
      Home
    </Header>
    )

  const main = (
    <Main>
      {
        (!isLoading && pools.length > 0) ?
        <Home pools={pools} trades24h={data.trades} liquidities24h={data.liquidities} />
        : <Skeleton count={5}/>
      }
    </Main>
    )

  return (
    <SubLayout header={header} main={main} />
    )
}
