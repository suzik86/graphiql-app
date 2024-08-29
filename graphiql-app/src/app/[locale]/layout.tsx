import { ConfigProvider } from "antd";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import Footer from "../../components/Footer/Footer";
import HeaderWrapper from "../../components/Header/HeaderWrapper";
import Spinner from "../../components/Spinner/Spinner";
import "../../theme/global.scss";
import "../../theme/normalize.scss";
import styles from "../../theme/wrappers.module.scss";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <Suspense fallback={<Spinner />}>
          <NextIntlClientProvider messages={messages}>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#7d81d6",
                  colorPrimaryHover: "#464bad",
                },
              }}
            >
              <div className={styles.wrapper}>
                <HeaderWrapper />
                <div className={styles.content}>{children}</div>
                <Footer />
              </div>
            </ConfigProvider>
          </NextIntlClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
