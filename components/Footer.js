import Image from 'next/image'
import logo from '../assets/vosm_logo.png'

export default function Footer() {
  return (
    <div className="flex mt-12 flex-col sm:flex-row min-h-12 sm:min-h-24 relative w-full bg-vosm-blue items-end px-4 sm:px-24 pb-10 pt-10">
      <div className="flex flex-col sm:flex-row items-center gap-x-5 ">
        <div className="hidden sm:block w-64">
          <Image
            quality={100}
            width={208}
            height={177}
            src={logo}
            alt="logo"
            layout="fixed"
          />
        </div>
        <div className="sm:block text-slate-50 font-normal ">
          <h1 className="text-xl sm:text-4xl font-semibold">
            4th Veterinary Ophthalmic <br /> Surgery Meeting
          </h1>
          <p className="text-xl font-sans font-normal">
            July 22-24<sup>th</sup> 2022, Chicago, IL
          </p>
        </div>
      </div>
    </div>
  )
}
