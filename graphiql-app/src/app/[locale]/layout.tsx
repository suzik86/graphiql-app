import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import Footer from "../../components/Footer/Footer";
import HeaderWrapper from "../../components/Header/HeaderWrapper";
import "../../theme/global.scss";
import "../../theme/normalize.scss";
import styles from "../../theme/wrappers.module.scss";
import { Suspense } from "react";
import Loading from "./loading";
import { ConfigProvider } from "antd";

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
        <Suspense fallback={<Loading />}>
          <NextIntlClientProvider messages={messages}>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#7d81d6",
                  colorPrimaryHover: "#464bad",
                  // style={{ background: "#7d81d6", color: "#000" }}
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
