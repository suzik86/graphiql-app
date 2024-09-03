"use client";
import { useLocale, useTranslations } from "next-intl";
import React, { FC, useEffect } from "react";
import styles from "./History.module.scss";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { useRouter } from "next/navigation";
import Spinner from "../Spinner/Spinner";
import WelcomeButton from "../WelcomeButton/WelcomeButton";
import useLocalStorage from "../../hooks/useLocalStorage";

const History: FC = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const t = useTranslations("History");
  const localActive = useLocale();
  const [requests] =
    (useLocalStorage("requests") as [
      string[],
      React.Dispatch<React.SetStateAction<string>>,
    ]) || [];

  const btns = [
    { link: "/", text: t("rest") },
    { link: `/${localActive}/GRAPHQL/{}`, text: t("graphiql") },
  ];

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/");
    }
  }, [user, loading, router]);

  return (
    <section className={styles.history}>
      <div className={styles.history__inner}>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <h1 className={styles.history__title}>{t("title")}</h1>
            {requests}
            {!requests && (
              <>
                <p className={styles.history__subtitle}>{t("empty")}</p>
                <ul className={styles.history__btns}>
                  {btns.map((item, index) => (
                    <li key={index}>
                      <WelcomeButton to={item.link} text={item.text} />
                    </li>
                  ))}
                </ul>
              </>
            )}

            {requests && requests.length > 0 && (
              <ul>
                {requests.map((request: string, index: number) => (
                  <li key={index}>{request}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default History;
