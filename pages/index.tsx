/* eslint-disable react/no-unescaped-entities */
import { Page, Button as ShopifyButton } from '@shopify/polaris'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import hyatt from '../assets/hyatt.png'
import Button from '../components/Buttons'
import { P, Title } from '../components/typography'
import Error from 'next/error'
import ComingSoon from '../components/ComingSoon'

const images = Array.from({ length: 8 }).map((_, i) => ({
  url: `/vosm-images/vosm-${i + 1}.png`,
}))
const Home: NextPage = () => {
  return <ComingSoon />
  return (
    <Page>
      <Head>
        <title>Veterinary Opthalmic Surgery Meeting</title>
        <meta
          name="description"
          content="We are excited to announce the 3rd Veterinary Ophthalmic Surgery Meeting. This long awaited event will be an innovative meeting, with a dynamic format developed to encourage a candid debate among Veterinary Ophthalmologists with interests in Surgery."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="grid min-h-screen grid-cols-1 gap-y-28 rounded-lg bg-white p-16 shadow-sm ">
        <section className="grid h-72 grid-cols-12 items-center">
          <div className="col-span-12 pr-10 text-justify sm:col-span-6">
            <Title className="leading-normal">The conference</Title>
            <P>
              This long awaited event will be an innovative meeting, with a
              dynamic format developed to encourage a candid debate among
              Veterinary Ophthalmologists with interests in Surgery.
            </P>
            <br />
            <P>
              This is a limited-space event that will take place on July 22-24
              <sup>th</sup>, 2022 in Chicago, IL. Come be part of an interactive
              gathering that will challenge and inspire young professionals and
              engage the most renowned clinicians with compelling case
              discussions, pertinent peals, updates from human meetings, and
              also a Keynote Lecture!
            </P>
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Swiper
              className="rounded-lg shadow-xl"
              modules={[Autoplay]}
              slidesPerView={1}
              autoHeight
              autoplay={{ delay: 1200 }}
              loop={true}
              centeredSlides={true}
              spaceBetween={50}
              onSlideChange={() => console.log('slide change')}
              onSwiper={(swiper) => console.log(swiper)}
            >
              {images.map((img, index) => {
                return (
                  <SwiperSlide key={img.url}>
                    <div className="w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={`vosm-image-${index + 1}`} />
                    </div>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>
        </section>

        <section className="grid">
          <Title className="pb-4 font-normal">Location</Title>
          <div className="flex flex-col sm:flex-row">
            <div className="relative w-5/12 overflow-hidden rounded-lg shadow-lg">
              <Image src={hyatt} layout="fill" objectFit="cover" alt="haytt" />
            </div>
            <div className="flex flex-col gap-y-5 pl-10 ">
              <div>
                <h2 className="pb-2 text-3xl text-vosm-blue underline underline-offset-4">
                  Hyatt Regency O'hare
                </h2>
                <h3 className=" font-sans  text-sm text-slate-600">
                  9300 Bryn Mawr Avenue <br />
                  Rosemont, Illinois 60018
                </h3>
              </div>
              <div>
                <h2 className="pb-2 text-2xl text-vosm-blue underline underline-offset-4">
                  Alternative nearby hotels
                </h2>
                <ul className="ml-5 grid list-disc gap-y-2 leading-loose text-slate-600 underline underline-offset-2 ">
                  <li>
                    <a href="">Hilton Rosemont</a>
                  </li>
                  <li>Embassy Suites</li>
                  <li>Double Tree</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="flex flex-col items-center gap-10">
          <Title>Sponsors</Title>
          <ul className="flex flex-wrap justify-center gap-10">
            {Array.from({ length: 7 }).map((sponsor, i) => (
              <li
                className={`flex items-center justify-center bg-vosm-light-blue text-slate-50 rounded-${
                  i % 2 === 0 ? 'full' : 'lg'
                }`}
                style={{ width: 200, height: 200 }}
                key={i}
              >
                sponsor {i + 1}
              </li>
            ))}
          </ul>
          <Link href="/sponsor" passHref>
            <ShopifyButton>Become a sponsor</ShopifyButton>
          </Link>
        </section>
      </div>
    </Page>
  )
}

export default Home
