
export const SubTitle = ({children}) => {
  return <span className='pl-2 text-gray-500 text-sm'>{children}</span>
}
export const SubLayout = ({header, main}) => {
  return (
    <>
    {header}
    {main}
    </>
    )
}
