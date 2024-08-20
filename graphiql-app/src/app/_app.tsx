import Head from 'next/head';
import '../styles/globals.css'; // Import global styles here
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
          <Head>
            
          <link rel="icon" href="/favicon.ico" />

            <meta name="description" content="Your custom description" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Your Page Title</title>
          </Head>
          <Component {...pageProps} />
        </>
      );
    }

    export default MyApp;