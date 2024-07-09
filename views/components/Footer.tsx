import Image from 'next/image';
import { logo } from '../../assets';

export default function Footer() {
  return (
    <div className="relative mt-12 flex min-h-12 w-full flex-col justify-center bg-vosm-blue px-4 pb-10 pt-10 text-center sm:min-h-24 sm:flex-row sm:px-24">
      <div className="flex justify-center gap-x-5 ">
        <div className="hidden w-32 sm:block">
          <Image quality={100} width={104} height={90} src={logo} alt="logo" layout="fixed" />
        </div>
        <div className="font-normal text-slate-50 sm:block ">
          <h1 className="text-lg font-semibold sm:text-2xl md:text-4xl">
            5th Veterinary Ophthalmic <br /> Surgery Meeting
          </h1>
          <p className="font-sans text-xl font-normal">
            July 19-21<sup>st</sup> 2024, Chicago, IL
          </p>
        </div>
      </div>
    </div>
  );
}
