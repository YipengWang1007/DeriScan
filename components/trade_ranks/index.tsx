import {bg} from '@/lib/utils'
import TradeRank from './trade_rank'

function TradeRanks({ tradeRanks}) {
  if (tradeRanks) {
    return (
      <div>
      <table className='divide-y divide-gray-200 w-full'>
      <thead className='bg-gray-50'>
      <tr>
      <th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
      Chain
      </th>
      <th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
      Pool
      </th>
      <th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
      Trader
      </th>
      <th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
      Pnl
      </th>
      <th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
      Updated At
      </th>
      </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {tradeRanks.sort((a,b) => bg(b.pnl).minus(a.pnl).toNumber()).map((e) => (
            <TradeRank key={e.id} id={e.id} chain_id={e.chain_id} pool={e.pool} trader={e.trader} pnl={e.pnl} updated_at={e.updated_at} />
        ))}
      </tbody>
      </table>
      </div>
    )
  } else {
    return null
  }
}

export default TradeRanks
