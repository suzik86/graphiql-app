"use client";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import Spinner from "../Spinner/Spinner";
import WelcomeButton from "../WelcomeButton/WelcomeButton";
import styles from "./History.module.scss";
import Link from "next/link";
import { formatDate } from "../../utils/formatDate";

const History: FC = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const t = useTranslations("History");
  const localActive = useLocale();

  const requests = useState<{ path: string; date: string; endpoint: string }[]>(
    () =>
      typeof window !== "undefined"
        ? JSON.parse(localStorage?.getItem("pathnames") || "[]")
        : [],
  )[0];

  const btns = [
    { link: `/${localActive}/GET/`, text: t("rest") },
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
            {(!requests || requests.length < 1) && (
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
                {requests
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
                  )
                  .map(
                    (
                      request: { path: string; date: string; endpoint: string },
                      index: number,
                    ) => (
                      <li key={index} className={styles.history__request}>
                        <div>{formatDate(request.date)}</div>
                        <div>
                          <Link
                            href={request.path}
                            className={styles.history__request__link}
                          >
                            {request.endpoint}
                          </Link>
                        </div>
                      </li>
                    ),
                  )}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default History;
