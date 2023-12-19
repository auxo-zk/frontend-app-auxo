import '../reactCOIServiceWorker';
import { Provider as JotaiProvider } from 'jotai';
import type { AppProps } from 'next/app';
import { FontInter, FontRaleway } from 'src/assets/fonts';
import Layout from 'src/layout/Layout';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <JotaiProvider>
            <style jsx global>{`
                html {
                    font-family: ${FontInter.style.fontFamily};
                }
            `}</style>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </JotaiProvider>
    );
}
