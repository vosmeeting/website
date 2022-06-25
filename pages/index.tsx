/* eslint-disable react/no-unescaped-entities */
import { Page, Layout, Card, List, Link as PolarisLink } from '@shopify/polaris'
import classNames from 'classnames'
import { capitalize, groupBy } from 'lodash'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import hyatt from '../assets/hyatt.png'
import Button from '../components/Buttons'
import { P, Title } from '../components/typography'
import { flags } from '../utils/featureFlag'

const images = Array.from({ length: 8 }).map((_, i) => ({
  url: `/vosm-images/vosm-${i + 1}.png`,
}))

class Medal {
  constructor(public name: string, public value: number, public icon?: any) {}
}
type Sponsor = {
  name: string
  medal: Medal
  filename: string
}

let [Prime, Platinum, Gold, Silver, Bronze] = [
  'prime',
  'platinum',
  'gold',
  'silver',
  'bronze',
].map((name, index) => new Medal(name, index))

Prime.icon = '🏅'
class SponsorRepo {
  _sponsors: Sponsor[] = [
    { name: 'AJL', medal: Silver, filename: 'ajl.png' },
    { name: 'Animal Necessity', medal: null, filename: null },
    { name: 'An-Vision', medal: Bronze, filename: 'an_vision.png' },
    { name: 'B&L', medal: Prime, filename: 'bl.png' },
    { name: 'ECFA', medal: Silver, filename: 'ecfa.png' },
    { name: 'MST', medal: Platinum, filename: 'mst.png' },
    { name: 'DIOPTRIX', medal: Gold, filename: 'dioptrix.png' },
    { name: 'SENTRX', medal: Gold, filename: 'sentrx.png' },
    { name: 'XORAN TECHNOLOGIES', medal: Bronze, filename: 'xoran.png' },
  ]
  baseUrl = '/sponsor-logos'

  get sponsors() {
    return this._sponsors
      .filter((s) => s.medal)
      .map((s) => ({
        ...s,
        imgSrc: this.baseUrl + '/' + s.filename,
      }))
  }

  get sponsorsGroupedByType() {
    return Object.entries(groupBy<Sponsor[]>(this.sponsors, 'medal.name'))
      .map(([medalName, sponsors]) => [sponsors[0].medal, sponsors])
      .sort(([medal], [medal2]) => medal.value - medal2.value)
  }
}

const data = new SponsorRepo()
console.log(data.sponsorsGroupedByType)

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

      <div className="font-sans text-base grid min-h-screen grid-cols-1 gap-y-12 rounded-lg bg-white p-4 shadow-sm sm:p-16">
        <section className="grid grid-cols-1 gap-12 lg:grid-cols-2">
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
              clinicians with compelling case discussions, pertinent peals, and
              also a Keynote Lecture!
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
              <br />
              Please register and a link to reserve a room will be provided.
            </div>
            <br />
            <div>
              <h2 className="pb-2 text-xl text-vosm-blue underline underline-offset-4 sm:text-2xl">
                Alternative Hotels
              </h2>
              (literally down the block)
              <div className="flex justify-center sm:block">
                <List>
                  {[
                    {
                      label: 'Hilton Rosemont',
                      link:
                        'https://www.hilton.com/en/hotels/ordhrhh-hilton-rosemont-chicago-ohare/',
                    },
                    {
                      label: 'Embassy Suites',
                      link:
                        'https://www.hilton.com/en/hotels/chirmes-embassy-suites-chicago-ohare-rosemont/',
                    },
                    {
                      label: 'Double Tree',
                      link:
                        'https://www.hilton.com/en/hotels/chidtdt-doubletree-chicago-ohare-airport-rosemont/',
                    },
                  ].map((e) => (
                    <List.Item key={e.label}>
                      <PolarisLink url={e.link} external>
                        {e.label}
                      </PolarisLink>
                    </List.Item>
                  ))}
                </List>
              </div>
            </div>
          </div>
        </section>
        {flags.sponsors && (
          <section className="flex flex-col gap-y-6 sm:gap-y-12">
            <Title className="text-center sm:text-left">Sponsors</Title>
            <div className="flex flex-col gap-y-20">
              {data.sponsorsGroupedByType.map(([medal, sponsors], i) => {
                const first = i === 0
                const second = i === 1
                const rest = i > 1
                // highest sponsor gets the biggest image width
                const imageWidth = first ? 500 : second ? 250 : 250

                return (
                  <div
                    key={medal.name}
                    className={classNames('flex gap-y-4 justify-left ', {
                      'flex-col': first || second,
                      'gap-x-10 items-center': rest,
                    })}
                  >
                    <h2
                      className={classNames('pb-2 underline', {
                        'text-center': true,
                        'text-4xl': first || second,
                        'text-3xl': rest,
                      })}
                    >
                      {medal.name
                        .toUpperCase()
                        .concat(medal.icon ? medal.icon : '')}
                    </h2>
                    <ul
                      className={classNames('flex flex-wrap gap-x-10 gap-y-5', {
                        'justify-center items-center': true,
                      })}
                    >
                      {sponsors.map((sponsor, i) => (
                        <li
                          key={sponsor.name}
                          className={`text-slate-50`}
                          style={{ width: imageWidth }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={sponsor.imgSrc}
                            alt={sponsor.name}
                            style={{
                              width: '100%',
                              objectFit: 'contain',
                              objectPosition: 'center',
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </Page>
  )
}

export default Home
