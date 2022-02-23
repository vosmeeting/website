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

const images = Array.from({ length: 8 }).map((_, i) => ({
  url: `/vosm-images/vosm-${i + 1}.png`,
}))
const Home: NextPage = () => {
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

      <div className="bg-white p-16 min-h-screen grid grid-cols-1 gap-y-28 shadow-sm rounded-lg ">
        <section className="grid grid-cols-12 h-72 items-center">
          <div className="pr-10 col-span-12 sm:col-span-6 text-justify">
            <Title className="leading-normal">The conference</Title>
            <P>
              This long awaited event will be an innovative meeting, with a
              dynamic format developed to encourage a candid debate among
              Veterinary Ophthalmologists with interests in Surgery.
            </P>
            <br />
            <P>
              This is a limited-space event that will take place on July
              22-24th, 2022 in Chicago, IL. Come be part of an interactive
              gathering that will challenge and inspire young professionals and
              engage the most renowned clinicians with compelling case
              discussions, pertinent peals, updates from human meetings, and
              also a Keynote Lecture!
            </P>
          </div>

          <div className="sm:col-span-5 col-span-12">
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

        <section className="">
          <Title className="font-normal pb-4">Location</Title>
          <div className="flex">
            <div className="w-5/12 relative rounded-lg shadow-lg overflow-hidden">
              <Image src={hyatt} layout="fill" objectFit="cover" alt="haytt" />
            </div>
            <div className="pl-10 flex flex-col gap-y-5 ">
              <div>
                <h2 className="text-3xl pb-2 text-vosm-blue underline underline-offset-4">
                  Hyatt Regency O'hare
                </h2>
                <h3 className=" text-sm  font-sans text-slate-600">
                  9300 Bryn Mawr Avenue <br />
                  Rosemont, Illinois 60018
                </h3>
              </div>
              <div>
                <h2 className="text-2xl pb-2 text-vosm-blue underline underline-offset-4">
                  Alternative nearby hotels
                </h2>
                <ul className="leading-loose list-disc ml-5 text-slate-600 underline underline-offset-2 grid gap-y-2 ">
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
        <section className="flex flex-col gap-10 items-center">
          <Title>Sponsors</Title>
          <ul className="flex flex-wrap justify-center gap-10">
            {Array.from({ length: 7 }).map((sponsor, i) => (
              <li
                className={`bg-vosm-light-blue flex items-center justify-center text-slate-50 rounded-${
                  i % 2 === 0 ? 'full' : 'lg'
                }`}
                style={{ width: 200, height: 200 }}
                key={i}
              >
                sponsor {i + 1}
              </li>
            ))}
          </ul>
          <Link href="/become-a-sponsor" passHref>
            <ShopifyButton>Become a sponsor</ShopifyButton>
          </Link>
        </section>
      </div>
    </Page>
  )
}

export default Home
