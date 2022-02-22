/* eslint-disable react/no-unescaped-entities */
import { Page } from '@shopify/polaris'
import type { NextPage } from 'next'
import Head from 'next/head'

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

      <div className="bg-white p-16 min-h-screen grid grid-cols-1 gap-y-28 shadow-sm rounded-lg ">payment success..</div>
    </Page>
  )
}

export default Home
