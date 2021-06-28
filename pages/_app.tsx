import '../styles/index.css'

import Nav from '@/components/nav'

function MyApp({ Component, pageProps }) {
  return (
    <div className="">
      <div className="bg-gray-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        <Nav />
        </div>
      </div>
    <Component {...pageProps} />
    </div>
    )
}

export default MyApp
