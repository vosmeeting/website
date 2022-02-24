import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../components/Header'
import Footer from '../components/Footer'
import enTranslations from '@shopify/polaris/locales/en.json'
import { AppProvider } from '@shopify/polaris'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider
      i18n={enTranslations}
      theme={{
        colors: {
          surface: '#111213',
          onSurface: '#111213',
          interactive: '#2e72d2',
          secondary: '#111213',
          primary: '#084F86',
          critical: '#d82c0d',
          warning: '#ffc453',
          highlight: '#5bcdda',
          success: '#008060',
          decorative: '#ffc96b',
        },
      }}
    >
      <Header />
      <div className="bg-slate-100 p-4 sm:p-8 md:p-16">
        <Component {...pageProps} />
      </div>
      <Footer />
    </AppProvider>
  )
}

export default MyApp
