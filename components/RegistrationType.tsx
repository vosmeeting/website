import React from 'react'
import classNames from 'classnames'
import { CheckIcon } from './icons'
import { RegistrationType } from '../constants/registrationType'

export function RegistrationType({
  priceInDollar = 0,
  label,
  optionalComment,
  checked,
  onChange,
  value,
  ...props
}: any) {
  const iconSize = 24
  return (
    <div className="mb-8">
      <label
        className={classNames(
          'shadow-sm p-2 flex justify-center gap-1 flex-col text-center rounded-lg relative h-full',
          {
            'border-2 shadow-xl border-vosm-blue': checked,
            border: !checked,
          }
        )}
      >
        {checked && (
          <div className={`absolute -top-3 -right-3`}>
            <CheckIcon size={iconSize} />
          </div>
        )}
        {label && <p className="font-normal text-slate-600">{label}</p>}
        <p className={classNames('font-bold text-vosm-blue')}>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(priceInDollar)}
        </p>
        <input
          type="radio"
          name="participant"
          className="hidden"
          checked={checked}
          onChange={(e) => {
            e.preventDefault()
            onChange(e.target.value)
          }}
          value={value}
          {...props}
        />
      </label>
      {optionalComment && (
        <p className="text-slate-500 text-xs italic mt-2">{optionalComment}</p>
      )}
    </div>
  )
}

type Props = {
  choiceList: RegistrationType[]
  selected: string
  onChange: (value: string) => any
  errorMessage?: string
}

export function RegistrationTypeList({
  choiceList = [],
  selected,
  onChange,
  errorMessage,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {choiceList.map(({ label, value, price, optionalComment }) => {
        return (
          <RegistrationType
            key={value}
            value={value}
            optionalComment={optionalComment}
            label={label}
            priceInDollar={price}
            checked={value === selected}
            onChange={onChange}
          />
        )
      })}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  )
}
