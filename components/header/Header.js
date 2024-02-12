import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import bg from '../../assets/header_bg.png'
import logo from '../../assets/vosm_logo.png'
import Button from '../Buttons'
import styles from './Header.module.scss'
import { appConfig } from '../../domain/appConfig'

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
            July 19-22<sup>nd</sup> 2024, Chicago, IL
          </p>
        </div>
      </div>
      {appConfig.ff.registration && (
        <div className={'button-group'}>
          <Button monochrome>
            <Link href={'/register'}>Register</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
export default Header
