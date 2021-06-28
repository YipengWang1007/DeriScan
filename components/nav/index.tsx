import Link from 'next/link'
// import Container from '@/components/container'
// import ButtonLink from '@/components/button-link'

export default function Nav() {
  return (
    <div className='flex items-center'>
    <div className='flex-shrink-0 text-white pr-6 font-serif font-medium text-xl'>DeriScan</div>
    <div className='flex items-baseline space-x-4'>
    {
      [
      {name: 'Home', url:'/'},
      {name: 'Trade', url:'/trade'},
      {name: 'Liquidity', url:'/liquidity'},
      {name: 'Trade Rank', url:'/trade_rank'},
      ].map((item, index) => {
        const key = index + 1
        return <div className='bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium' key={key}><Link href={item.url}>{item.name}</Link></div>
      })
    }
    </div>
    </div>
  )
}
