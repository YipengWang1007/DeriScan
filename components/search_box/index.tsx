function SearchBox({keyword, setKeyword}) {
  return (
    <div className='flex relative'>
      <input
      type='text'
      name='search'
      id='search'
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      className='flex-1 border w-96 py-1 px-2 border-gray-300 focus:border-none outline-none focus:ring-2 focus:ring-blue-500 rounded-md font-mono'
      style={{width:'28rem'}}
      placeholder="please type address" />
      {
        keyword !== '' ?
        <svg onClick={(e) => setKeyword('')} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute right-1 top-1 hover:bg-gray-200 rounded" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        : ''
      }
    </div>
    )
}
export default SearchBox
