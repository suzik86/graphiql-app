"use client";
import { notification } from "antd";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import GraphiqlImage from "../../assets/graphiql.png";
import RestImage from "../../assets/rest.png";
import GraphQlPicture from "../../assets/graphql.png";
import HttpPicture from "../../assets/http.png";
import { auth, db } from "../../firebase";
import AboutCourseComponent from "../AboutCourseComponent/AboutCourseComponent";
import AboutUsComponent from "../AboutUsComponent/AboutUsComponent";
import MainPageProjectInfo from "../MainPageProjectInfo/MainPageProjectInfo";
import Spinner from "../Spinner/Spinner";
import TryComponent from "../TryComponent/TryComponent";
import WelcomeButton from "../WelcomeButton/WelcomeButton";
import styles from "./MainPage.module.scss";

function MainPage() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const router = useRouter();
  const t = useTranslations("HomePage");
  const localActive = useLocale();
  const [api, contextHolder] = notification.useNotification();

  const btns = [
    { link: `/${localActive}/GET/`, text: t("rest") },
    { link: `/${localActive}/GRAPHQL/{}`, text: t("graphiql") },
    { link: `/${localActive}/history`, text: t("history") },
  ];

  const fetchUserName = useCallback(async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error((err as Error).message);
      api.error({
        message: t("fetch-error"),
      });
    }
  }, [user, setName, api, t]);

  useEffect(() => {
    if (loading) return;
    if (user) {
      fetchUserName();
    }
  }, [user, loading, router, fetchUserName]);

  return (
    <>
      {contextHolder}
      <section className={styles.welcome}>
        <div className={styles.welcome__inner}>
          {loading ? (
            <Spinner />
          ) : user ? (
            <>
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
              </div>
            </>
          ) : (
            <>
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
                  <Link
                    className={styles.link}
                    href={`/${localActive}/register`}
                  >
                    {t("sign-up")}
                  </Link>
                </div>
              </div>
              <AboutCourseComponent />
              <MainPageProjectInfo
                img1={GraphiqlImage}
                img2={RestImage}
                title={t("article-1")}
              />
              <AboutUsComponent />
              <TryComponent />
            </>
          )}
        </div>
      </section>
    </>
  );
}
export default MainPage;
