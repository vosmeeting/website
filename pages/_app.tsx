import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../components/Header'
import Footer from '../components/Footer'
import enTranslations from '@shopify/polaris/locales/en.json'
import { AppProvider, CustomProperties } from '@shopify/polaris'
import styles from './CustomPropertyOverride.module.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider i18n={enTranslations}>
      <CustomProperties className={styles.CustomPropertyOverrides}>
        <Header />
        <div className="bg-slate-100 p-4 sm:p-8 md:p-16">
          <Component {...pageProps} />
        </div>
        <Footer />
      </CustomProperties>
    </AppProvider>
  )
}

export default MyApp
