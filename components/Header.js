import React from 'react'
import Image from 'next/image'
import bg from '../assets/header_bg.png'
import logo from '../assets/vosm_logo.png'
import Button from './Buttons'
import Link from 'next/link'

// TODO: haven't handled the responsive design extensively
const Header = () => {
  return (
    <div className="min-h-72 relative w-full bg-vosm-blue flex flex-row justify-between items-end px-4 xl:px-24 pb-10 pt-10">
      <Image
        className="mix-blend-color-burn "
        alt="building"
        src={bg}
        layout="fill"
        objectFit="cover"
        quality={100}
      />

      <div className="flex flex-col md:flex-row items-center gap-x-5 ">
        <div className="w-64 text-center ">
          <Image
            quality={100}
            width={208}
            height={177}
            src={logo}
            alt="logo"
            layout="fixed"
          />
        </div>
        <div className="text-slate-50 font-normal text-center sm:text-left">
          <p className="text-2xl">We are excited to announce</p>
          <h1 className=" text-xl sm:text-4xl font-semibold">
            4th Veterinary Ophthalmic Surgery Meeting
          </h1>
          <p className="text-xl font-sans font-normal">
            July 22-24<sup>th</sup> 2022, Chicago, IL
          </p>
        </div>
      </div>

      <div className="justify-between items-center gap-2 z-10 hidden sm:flex">
        <Button variant="secondary" className="px-10">
          <Link href={'/register'}>Register Now</Link>
        </Button>
      </div>
    </div>
  )
}
export default Header
