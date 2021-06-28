import Trade from './trade'

function Trades({ trades}) {
  if (trades) {
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
     Direction
      </th>
      <th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
      Volume
      </th>
      <th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
      Price
      </th>
      <th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
      Notional
      </th>
      <th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
      Tx Hash
      </th>
      <th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
      Age
      </th>
      </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {trades.map((e) => (
            <Trade key={e.id} id={e.id} chain_id={e.chain_id} pool={e.pool} trader={e.trader} direction={e.direction} volume={e.volume0} price={e.price} notional={e.notional} tx_hash={e.tx_hash} timestamp={e.timestamp} />
        ))}
      </tbody>
      </table>
      </div>
    )
  } else {
    return null
  }
}

export default Trades
