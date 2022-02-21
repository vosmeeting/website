import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../components/Header'
import Footer from '../components/Footer'
import enTranslations from '@shopify/polaris/locales/en.json'
import { AppProvider, Page } from '@shopify/polaris'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider i18n={enTranslations}>
        <Header />
      <div className="bg-slate-100 p-16">
          <Component {...pageProps} />
      </div>
        <Footer />
    </AppProvider>
  )
}

export default MyApp
