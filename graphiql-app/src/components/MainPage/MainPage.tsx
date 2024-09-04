"use client";
import { notification } from "antd";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import Spinner from "../Spinner/Spinner";
import WelcomeButton from "../WelcomeButton/WelcomeButton";
import styles from "./MainPage.module.scss";
import GraphQlPicture from "../../assets/graphql.png";
import HttpPicture from "../../assets/http.png";
import MainPageProjectInfo from "../MainPageProjectInfo/MainPageProjectInfo";
import AppImage from "../../assets/App.png";
import AboutUsComponent from "../AboutUsComponent/AboutUsComponent";
import TryComponent from "../TryComponent/TryComponent";
type NotificationType = "success" | "info" | "warning" | "error";

function MainPage() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const router = useRouter();
  const t = useTranslations("HomePage");
  const localActive = useLocale();
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: t("fetch-error"),
    });
  };

  const btns = [
    { link: "/", text: t("rest") },
    { link: `/${localActive}/GRAPHQL/{}`, text: t("graphiql") },
    { link: `/${localActive}/history`, text: t("history") },
  ];

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error((err as Error).message);
      openNotificationWithIcon("error");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/");
    }
    fetchUserName();
  }, [user, loading, router]);

  return (
    <>
      {contextHolder}
      <section className={styles.welcome}>
        <div className={styles.welcome__inner}>
          {loading ? (
            <Spinner />
          ) : user ? (
            <>
              <h1 className={styles.welcome__title}>
                {name}, {t("welcome-back")}!
              </h1>
              <h2 className={styles.welcome__subtitle}>{t("question")}</h2>
              <ul className={styles.welcome__btns}>
                {btns.map((item, index) => (
                  <li key={index}>
                    <WelcomeButton to={item.link} text={item.text} />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className={styles.welcome__preview}>
              <Image
                className={`${styles.welcome__preview__image} ${styles.welcome__preview__left}`}
                src={HttpPicture}
                alt="http"
              />
              <Image
                className={`${styles.welcome__preview__image} ${styles.welcome__preview__right}`}
                src={GraphQlPicture}
                alt="graphQl"
              />
              <h1 className={styles.welcome__title}>{t("welcome")}</h1>
              <div className={styles.links__wrapper}>
                <Link className={styles.link} href={`/${localActive}/login`}>
                  {t("sign-in")}
                </Link>
                <Link className={styles.link} href={`/${localActive}/register`}>
                  {t("sign-up")}
                </Link>
              </div>
            </div>
          )}
          <MainPageProjectInfo
            img1={AppImage}
            img2={AppImage}
            title={t("article-1")}
          />
          <MainPageProjectInfo
            img1={AppImage}
            img2={AppImage}
            title={t("article-2")}
          />
          <AboutUsComponent />
          <TryComponent />
        </div>
      </section>
    </>
  );
}
export default MainPage;
