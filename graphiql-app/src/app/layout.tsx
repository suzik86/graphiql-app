import type { Metadata } from "next";
import { Inter } from "next/font/google";
import styles from "../theme/wrappers.module.scss"
import "../theme/global.scss"
const inter = Inter({ subsets: ["latin"] });
import "../theme/normalize.scss"
import Footer from "../components/Footer/Footer";
import HeaderWrapper from "../components/Header/HeaderWrapper";
 

 
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
 
}: Readonly<{
  children: React.ReactNode;
 
}>) {
 
  return (
    <html lang="en">
      <body className={inter.className}>
      
        <div className={styles.wrapper}>
          <HeaderWrapper />
          <div className={styles.content}>

            {children}
          </div>
          <Footer />
        </div>
    
      </body>
    </html>
  );
}
