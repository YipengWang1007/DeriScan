import Liquidity from './liquidity'

function Liquidities({ liquidities}) {
  if (liquidities) {
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
      LP Provider
      </th>
      <th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
      Direction
      </th>
      <th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
      Volume
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
        {liquidities.map((e) => (
            <Liquidity key={e.id} id={e.id} chain_id={e.chain_id} pool={e.pool} trader={e.lp_provider} amount={e.amount} tx_hash={e.tx_hash} timestamp={e.timestamp} />
        ))}
      </tbody>
      </table>
      </div>
    )
  } else {
    return null
  }
}

export default Liquidities
