import { Page, List, Link as PolarisLink } from '@shopify/polaris';
import classNames from 'classnames';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import hyatt from './hyatt.png';
import { P, Title } from '../../components/typography';
import { appConfig } from '../../../domain/config/appConfig';
import { SponsorRepo, images } from './data';

const data = new SponsorRepo();

export const Home: NextPage = () => {
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

      <div className="grid min-h-screen grid-cols-1 gap-y-12 rounded-lg bg-white p-4 font-sans text-base shadow-sm sm:p-16">
        <section className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="sm:text-justify">
            <Title className="leading-normal">The Conference</Title>
            <P>
              We are excited to announce the <b>5th</b> Veterinary Ophthalmic Surgery Meeting. This
              long awaited event will be an innovative meeting, with a dynamic format developed to
              encourage a candid debate among Veterinary Ophthalmologists with interests in Surgery.
            </P>
            <br />
            <P>
              This is a limited-space event that will take place on July 19-21
              <sup>st</sup>, 2024 in Chicago, IL.
            </P>
            <br />
            <P>
              Come be part of an interactive gathering that will challenge and inspire young
              professionals and engage the most renowned clinicians with compelling case
              discussions, pertinent peals, and also a Keynote Lecture!
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
            >
              {images.map((img, index) => {
                return (
                  <SwiperSlide key={img.url}>
                    <div className="w-full">
                      <img src={img.url} alt={`vosm-image-${index + 1}`} />
                    </div>
                  </SwiperSlide>
                );
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
                      link: 'https://www.hilton.com/en/hotels/ordhrhh-hilton-rosemont-chicago-ohare/'
                    },
                    {
                      label: 'Embassy Suites',
                      link: 'https://www.hilton.com/en/hotels/chirmes-embassy-suites-chicago-ohare-rosemont/'
                    },
                    {
                      label: 'Double Tree',
                      link: 'https://www.hilton.com/en/hotels/chidtdt-doubletree-chicago-ohare-airport-rosemont/'
                    }
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
        {appConfig.ff.sponsors && (
          <section className="flex flex-col gap-y-6 sm:gap-y-12">
            <Title className="text-center sm:text-left">2022 Sponsors</Title>
            <div className="flex flex-col gap-y-20">
              {data.sponsorsGroupedByType.map(([medal, sponsors], i) => {
                const first = i === 0;
                const second = i === 1;
                const rest = i > 1;
                // highest sponsor gets the biggest image width
                const imageWidth = first ? '80%' : second ? 250 : 250;

                return (
                  <div
                    key={medal.name}
                    className={classNames('flex flex-col items-center gap-y-6 ', {
                      'sm:flex-row': rest,
                      'items-center gap-x-10': rest
                    })}
                  >
                    <h2
                      className={classNames(
                        'rounded-full bg-vosm-light-blue px-5 py-1 pb-2 text-vosm-blue sm:px-10 sm:py-2',
                        {
                          'text-center': true,
                          'text-xl sm:text-2xl': true
                        }
                      )}
                    >
                      {medal.name.toUpperCase()}
                    </h2>
                    <ul
                      className={classNames('flex flex-wrap gap-x-10 gap-y-5', {
                        'items-center justify-center': true
                      })}
                    >
                      {sponsors.map((sponsor, i) => (
                        <li
                          key={sponsor.name}
                          className={`text-slate-50`}
                          style={{ width: imageWidth }}
                        >
                          <img
                            src={sponsor.staticImageData?.src}
                            alt={sponsor.name}
                            style={{
                              width: '100%',
                              objectFit: 'contain',
                              objectPosition: 'center'
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </Page>
  );
};
