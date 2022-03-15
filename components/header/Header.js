import { TextContainer } from '@shopify/polaris'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import bg from '../../assets/header_bg.png'
import logo from '../../assets/vosm_logo.png'
import Button from '../Buttons'
import styles from './Header.module.scss'

// TODO: haven't handled the responsive design extensively
const Header = () => {
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
        <div className={'logo'}>
          <Image layout="responsive" alt="logo" src={logo} />
        </div>

        <div className="text-center font-normal text-slate-50 sm:text-left">
          <p className="text-xl">We are excited to announce</p>
          <h1 className=" text-xl font-semibold sm:text-4xl">
            4th Veterinary Ophthalmic Surgery Meeting
          </h1>
          <p className="font-sans text-xl font-normal">
            July 22-24<sup>th</sup> 2022, Chicago, IL
          </p>
        </div>
      </div>
      <div className={'button-group'}>
        <Button monochrome>
          <Link href={'/register'}>Register</Link>
        </Button>
      </div>
    </div>
  )
}
export default Header
