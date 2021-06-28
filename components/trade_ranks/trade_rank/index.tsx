import {toNatural, toAddressUrl, compactAddress, directionClass, timeAgo, bg} from '@/lib/utils'

function Trade({ id, chain_id, pool, trader, pnl, updated_at }) {
  return (
    <tr className='text-gray-800' key={id}>
    <td className='px-2 py-2 whitespace-nowrap font-mono'>
    {chain_id}
    </td>
    <td className='px-2 py-2 whitespace-nowrap'>
    <a className='text-blue-700 font-mono' href={toAddressUrl(chain_id,pool)} target='_blank' title={pool} >{compactAddress(pool)}</a>
    </td>
    <td className='px-2 py-2 whitespace-nowrap'>
      <a className='text-blue-700 font-mono' href={toAddressUrl(chain_id,trader)} target='_blank' title={trader} >{trader}</a>
    </td>
    <td className='px-2 py-2 whitespace-nowrap font-mono'>
    {bg(pnl).toFixed(2).toString()}
    </td>
    <td className='px-2 py-2 whitespace-nowrap'>
    <span className='text-sm' title={updated_at}>{timeAgo(updated_at)}</span>
    </td>
    </tr>
  )
}

export default Trade
