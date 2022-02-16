import cx from 'classnames'
import React from 'react'

const Button = ({ variant = 'primary', className, ...props }) => {
  return (
    <button
      className={cx(
        'rounded-full py-2 whitespace-nowrap  hover:shadow-xl',
        {
          'text-vosm-blue ripple-bg-vosm-light-blue': variant === 'primary',
          'ripple-bg-slate-50 text-vosm-blue': variant === 'secondary',
        },
        className,
      )}
      {...props}
    />
  )
}

export default Button
