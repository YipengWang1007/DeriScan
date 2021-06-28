import {toNatural, toAddressUrl, compactAddress, liquidityDirection, directionClass, timeAgo} from '@/lib/utils'

function Liquidity({ id, chain_id, pool, trader, amount, tx_hash, timestamp }) {
  return (
    <tr className='text-gray-800' key={id}>
    <td className='px-2 py-2 whitespace-nowrap font-mono'>
    {chain_id}
    </td>
    <td className='px-2 py-2 whitespace-nowrap'>
    <a className='text-blue-700 font-mono' href={toAddressUrl(chain_id,pool)} target='_blank' title={pool} >{compactAddress(pool)}</a>
    </td>
    <td className='px-2 py-2 whitespace-nowrap'>
      <a className='text-blue-700 font-mono' href={toAddressUrl(chain_id,trader)} target='_blank' title={trader} >{compactAddress(trader)}</a>
    </td>
    <td className='px-2 py-2 whitespace-nowrap'>
    <span className={directionClass(liquidityDirection(amount))}>{liquidityDirection(amount)}</span>
    </td>
    <td className='px-2 py-2 whitespace-nowrap font-mono'>
    {toNatural(amount)}
    </td>
    <td className='px-2 py-2 whitespace-nowrap'>
      <a className='text-blue-700 font-mono' href={toAddressUrl(chain_id,tx_hash, 'tx')} target='_blank' title={tx_hash} >{compactAddress(tx_hash)}</a>
    </td>
    <td className='px-2 py-2 whitespace-nowrap'>
    <span className='text-sm' title={timestamp}>{timeAgo(timestamp)}</span>
    </td>
    </tr>
  )
}

export default Liquidity
