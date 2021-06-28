import Skeleton from 'react-loading-skeleton'
import {useState} from 'react'
import useSWR from 'swr'

import Liquidities from '@/components/liquidities'
import {Main} from '@/components/main'
import {Header} from '@/components/header'
import SearchBox from '@/components/search_box'
import { fetcher } from '@/lib/swr-hooks'
import { validateAddress } from '@/lib/shared'
import {SubLayout, SubTitle} from '@/components/shared'

export default function IndexPage() {
  const [input, setInput] = useState('')

  const { data:liquidities, error } = useSWR(validateAddress(input) ? `/api/get-liquidities/${input.trim()}` : `/api/get-liquidities` , fetcher)

  const header = (
    <Header>
    <div> Liquidity Events
      {validateAddress(input) ? <SubTitle>for {input}</SubTitle> : <SubTitle>in last 7 days</SubTitle>}
    </div>
     <div>
        <SearchBox keyword={input} setKeyword={setInput} />
     </div>
    </Header>
    )

  const main = (
    <Main> 
      {
        (!error && !liquidities) ? <Skeleton count={5}/> :
        <Liquidities liquidities={liquidities} />
      }
    </Main>
    )

  return (
    <SubLayout header={header} main={main} />
    )
}
