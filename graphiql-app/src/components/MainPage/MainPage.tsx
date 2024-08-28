"use client";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../../firebase";
import styles from "./MainPage.module.scss";
import { useLocale, useTranslations } from "next-intl";
import WelcomeButton from "../WelcomeButton/WelcomeButton";
import Spinner from "../Spinner/Spinner";

function MainPage() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const router = useRouter();
  const t = useTranslations("HomePage");
  const localActive = useLocale();

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
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/");
    }
    fetchUserName();
  }, [user, loading]);

  return (
    <section className={styles.welcome}>
      <div className={styles.welcome__inner}>
        {loading || !name ? (
          <Spinner />
        ) : (
          <>
            <h1 className={styles.welcome__title}>
              {name}, {t("welcome")}!
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
        )}
      </div>
    </section>
  );
}
export default MainPage;
