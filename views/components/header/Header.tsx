import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import bg from './header_bg.png';
import logo from '../../../assets/vosm_logo.png';
import Button from '../Buttons';
import styles from './Header.module.scss';

type Props = {
  ctaConfig?: {
    copy: string;
    disabled?: boolean;
  };
};

export const Header = ({ ctaConfig }: Props) => {
  return (
    <div className={styles.main}>
      <Image
        className="z-0 mix-blend-color-burn"
        alt="building"
        src={bg}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        quality={100}
      />
      <div className={styles['logo-and-title']}>
        <div className="logo">
          <Link passHref href="/">
            <Image layout="responsive" alt="logo" src={logo} />
          </Link>
        </div>

        <div className="text-center font-normal text-slate-50 sm:text-left">
          <p className="text-xl">We are excited to announce</p>
          <h1 className=" text-xl font-semibold sm:text-4xl">
            5th Veterinary Ophthalmic Surgery Meeting
          </h1>
          <p className="font-sans text-xl font-normal">
            July 19-21<sup>st</sup> 2024, Chicago, IL
          </p>
        </div>
      </div>
      {ctaConfig && (
        <div className={'button-group'}>
          <Button disabled={ctaConfig.disabled} monochrome>
            <Link href={'/register'}>{ctaConfig.copy}</Link>
          </Button>
        </div>
      )}
    </div>
  );
};
