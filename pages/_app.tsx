import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../components/Header'
import Footer from '../components/Footer'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col items-center bg-slate-100">
      <Header />
      <main className="xl:px-16 py-16 sm:max-w-7xl">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  )
}

export default MyApp
