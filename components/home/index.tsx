import {toNatural, bg} from '@/lib/utils'

const Card = ({title, label1, value1, label2, value2}) => {
  return (
        <div className='flex mb-4 px-4 py-4 shadow'>
          <div className='flex-1 flex items-center text-gray-700'>
          <div className='justify-self-center'>{title}</div>
          </div>
          <div className='flex-1 text-center'>
          <div className='text-gray-500 text-xs uppercase mb-1'>{label1}</div>
          <div className='text-gray-600 text-2xl font-medium'>{value1}</div>
          </div>
          <div className='flex-1 text-center'>
          <div className='text-gray-500 text-xs uppercase mb-1'>{label2}</div>
          <div className='text-gray-600 text-2xl font-medium'>{value2}</div>
          </div>
        </div>
    )
}
const PoolCard = ({pool}) => {
  return (
        <div className='flex mb-4 px-4 py-4 shadow'> <div className='flex-1 flex text-gray-700'>
          <div className=''>
            <div className='text-gray-500 text-xs uppercase mb-1'>Pool</div>
              <div className='font-mono'>{pool.pool}</div>
            </div>
          </div>
          <div className='flex-1 text-center'>
          <div className='text-gray-500 text-xs uppercase mb-1'>liquidity</div>
          {pool.liquidities.map((liquidity, index) => {
            const bTokens = pool.bTokens.map((b) => b.bTokenSymbol)
            return <div key ={`${liquidity}:${index}`} className='text-gray-600 text-2xl font-medium'>{liquidity} <span className='text-sm'>{bTokens[index]}</span></div>
          })}
          </div>
          <div className='flex-1 text-center'>
          <div className='text-gray-500 text-xs uppercase mb-1'>traders net volume</div>
          {pool.tradersNetVolumes.map((v, index) => {
            const symbols = pool.symbols.map((b) => b.symbol)
            return <div key ={`${v}:${index}`} className='text-gray-600 text-2xl font-medium'><span className='text-sm'>{symbols[index]}:</span> {v} </div>
          })}
          </div>
        </div>
    )
}


function Home({ pools, trades24h, liquidities24h }) {
  // console.log('trades', trades24h)
  // console.log('liquidities', liquidities24h)
  // console.log('pools', pools)
  // if (trades24h && liquidities24h && pools) {
  if (trades24h && liquidities24h) {
    const filteredTrades = trades24h.filter((t) => t.direction === 'LONG' || t.direction === 'SHORT')
    const liquidation = trades24h.filter((t) => t.direction === 'LIQUIDATION')
    return (
      <div>
        <div>
      <PoolCard pool={pools[0]} />
        </div>
        <div>
          <div className='text-gray-600 pt-6 pb-4'>
            Report in last 24 hours
          </div>
          <Card title="Trading" label1='count' value1={filteredTrades.length} label2='notional' value2={filteredTrades.reduce((accum, a) => accum.plus(bg(a.notional, -18).abs()), bg(0)).toFixed(2).toString()} />
          <Card title="Liquidation" label1='count' value1={liquidation.length} label2='notional' value2={liquidation.reduce((accum, a) => accum.plus(bg(a.notional0, -18).abs()), bg(0)).toFixed(2).toString()} />
          <Card title="Liquidity" label1='count' value1={liquidities24h.length} label2='liquidity' value2={liquidities24h.reduce((accum, a) => accum.plus(bg(a.amount, -18)), bg(0)).toFixed(2).toString()} />
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default Home
