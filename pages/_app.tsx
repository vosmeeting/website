import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ResponsiveAppBar from '../components/ResponsiveAppBar'
import Image from 'next/image'
import banner from '../assets/banner3.jpeg'
import { createTheme, ThemeProvider } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#0745a3',
    },
    secondary: {
      main: '#f50057',
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <ResponsiveAppBar />
        <Image
          height={200}
          layout="responsive"
          objectFit="cover"
          objectPosition="center"
          src={banner}
          alt=""
        />
        <main style={{ padding: '0 2rem' }}>
          <Component {...pageProps} />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default MyApp
