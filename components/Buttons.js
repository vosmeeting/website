import { Spinner } from '@shopify/polaris'
import cx from 'classnames'
import React from 'react'

const Button = ({ variant = 'primary', className = '', loading = false, children, ...props }) => {
  return (
    <button
      className={cx(
        'rounded-full py-2 whitespace-nowrap flex justify-center  hover:shadow-xl disabled:bg-slate-400 disabled:text-slate-200 disabled:hover:shadow-none',
        {
          'text-vosm-blue ripple-bg-vosm-light-blue': variant === 'primary',
          'ripple-bg-slate-50 text-vosm-blue': variant === 'secondary',
        },
        className,
      )}
      {...props}>{
        loading ? <Spinner size="small" /> : children
      }</button>
  )
}

export default Button
