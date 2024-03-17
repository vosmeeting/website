import React from 'react';
import classNames from 'classnames';
import { CheckIcon } from './icons/CheckIcon';
import { RegistrationType } from '../../domain/config/appConfig';

export function RegistrationType({
  priceInDollar = 0,
  label,
  optionalComment,
  checked,
  onChange,
  value,
  ...props
}: any) {
  const iconSize = 24;
  return (
    <div className="mb-8">
      <label
        className={classNames(
          'relative flex h-full flex-col justify-center gap-1 rounded-lg p-2 text-center shadow-sm',
          {
            'border-2 border-vosm-blue shadow-xl': checked,
            border: !checked
          }
        )}
      >
        {checked && (
          <div className={`absolute -right-3 -top-3`}>
            <CheckIcon size={iconSize} />
          </div>
        )}
        {label && <p className="font-normal text-slate-600">{label}</p>}
        <p className={classNames('font-bold text-vosm-blue')}>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(priceInDollar)}
        </p>
        <input
          type="radio"
          name="participant"
          className="hidden"
          checked={checked}
          onChange={(e) => {
            e.preventDefault();
            onChange(e.target.value);
          }}
          value={value}
          {...props}
        />
      </label>
      {optionalComment && <p className="mt-2 text-xs italic text-slate-500">{optionalComment}</p>}
    </div>
  );
}

type Props = {
  choiceList: RegistrationType[];
  selected: string;
  onChange: (value: string) => any;
  errorMessage?: string;
};

export function RegistrationTypeList({ choiceList = [], selected, onChange, errorMessage }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        );
      })}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}
