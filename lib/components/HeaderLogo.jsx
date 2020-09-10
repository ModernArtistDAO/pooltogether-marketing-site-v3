import React from 'react'
import Link from 'next/link'

export const HeaderLogo = (props) => {
  return <>
    <div
      className='nav--pool-logo-container justify-start flex items-center truncate'
    >
      <Link
        href='/'
        as='/'
        shallow
      >
        <a
          title={'Back to home'}
          className='pool-logo border-0 trans block w-full'
        />
      </Link>
    </div>
  </>
}
