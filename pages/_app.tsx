import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Footer from '../components/Footer'
import enTranslations from '@shopify/polaris/locales/en.json'
import { AppProvider, CustomProperties } from '@shopify/polaris'
import styles from './CustomPropertyOverride.module.scss'
import { Header } from '../components/header'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useRouter } from 'next/router'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const landingPageConfig = {
    copy: 'Registration Opening Soon',
    disabled: true,
  }
  const homePage = router.pathname === '/'
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider i18n={enTranslations}>
        <CustomProperties className={styles.CustomPropertyOverrides}>
          <Header ctaConfig={homePage ? landingPageConfig : undefined} />
          <div className="bg-slate-100 p-4 sm:p-8 md:p-16">
            <Component {...pageProps} />
          </div>
          <Footer />
        </CustomProperties>
      </AppProvider>
    </QueryClientProvider>
  )
}

export default MyApp
