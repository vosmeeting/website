import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Footer from '../views/components/Footer';
import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider, CustomProperties } from '@shopify/polaris';
import styles from '../styles/CustomPropertyOverride.module.scss';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useRouter } from 'next/router';
import { Header } from '../views/components/header/Header';
import { appConfig } from '../domain/config/appConfig';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const landingPageConfig = appConfig.ff.registration
    ? { copy: 'Register', disabled: false }
    : { copy: 'Registration Opening Soon', disabled: true };

  const homePage = router.pathname === '/';
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
  );
}

export default MyApp;
