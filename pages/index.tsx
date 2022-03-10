/* eslint-disable react/no-unescaped-entities */
import { Page, Layout, Card, List, Link as PolarisLink } from '@shopify/polaris'
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

      <div className="grid min-h-screen grid-cols-1 gap-y-12 rounded-lg bg-white p-4 shadow-sm sm:p-16">
        <section className="grid grid-cols-1 gap-12 sm:grid-cols-2">
          <div className="sm:text-justify">
            <Title className="leading-normal">The Conference</Title>
            <P>
              We are excited to announce the <b>4th</b> Veterinary Ophthalmic
              Surgery Meeting. This long awaited event will be an innovative
              meeting, with a dynamic format developed to encourage a candid
              debate among Veterinary Ophthalmologists with interests in
              Surgery.
            </P>
            <br />
            <P>
              This is a limited-space event that will take place on July 22-24
              <sup>th</sup>, 2022 in Chicago, IL.
            </P>
            <br />
            <P>
              Come be part of an interactive gathering that will challenge and
              inspire young professionals and engage the most renowned
              clinicians with compelling case discussions, pertinent peals,
              updates from human meetings, and also a Keynote Lecture!
            </P>
          </div>

          <div>
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

        <section className="grid grid-cols-1 gap-x-12 text-center sm:grid-cols-2 sm:text-left">
          <Title className="col-span-full font-normal">Location</Title>

          <div className="relative">
            <Image src={hyatt} layout="fill" objectFit="cover" alt="haytt" />
          </div>
          <div className="">
            <div>
              <h2 className="pb-2 text-xl text-vosm-blue underline underline-offset-4 sm:text-3xl">
                <a
                  href="https://www.hyatt.com/hotel/illinois/hyatt-regency-ohare/chiro"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hyatt Regency O'Hare
                </a>
              </h2>
              <h3 className=" font-sans  text-sm text-slate-600">
                9300 Bryn Mawr Avenue <br />
                Rosemont, Illinois 60018
              </h3>
              (5 minutes from the airport)
            </div>
            <br />
            <div>
              <h2 className="pb-2 text-xl text-vosm-blue underline underline-offset-4 sm:text-2xl">
                Alternative Hotels
              </h2>
              (literally down the block)
              <div className="flex justify-center sm:block">
                <List>
                  {['Hilton Rosemont', 'Embassy Suites', 'Double Tree'].map(
                    (e) => (
                      <List.Item key={e}>
                        <PolarisLink url="" external>
                          {e}
                        </PolarisLink>
                      </List.Item>
                    )
                  )}
                </List>
              </div>
            </div>
          </div>
        </section>
        <section className="flex flex-col items-center gap-y-6 sm:gap-y-12">
          <Title className="text-center sm:text-left">Sponsors</Title>
          <ul className="flex flex-wrap justify-center gap-10">
            {Array.from({ length: 3 }).map((sponsor, i) => (
              <li
                className={`flex items-center justify-center rounded-2xl bg-vosm-light-blue text-slate-50`}
                style={{ width: 200, height: 200 }}
                key={i}
              >
                sponsor {i + 1}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Page>
  )
}

export default Home
