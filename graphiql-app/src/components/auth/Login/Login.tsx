"use client";
import { Button, Form, FormProps, Input } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";
import Spinner from "../../Spinner/Spinner";
import styles from "./Login.module.scss";

type LoginFormData = {
  email: string;
  password: string;
};

function Login() {
  //const [user, loading, error] = useAuthState(auth);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const localActive = useLocale();
  const t = useTranslations("Login");

  const onFinish: FormProps<LoginFormData>["onFinish"] = (values) => {
    signInWithEmailAndPassword(auth, values.email, values.password);
  };

  useEffect(() => {
    if (user) router.push(`/${localActive}/main`);
  }, [user, loading]);

  return (
    <>
      {!loading ? (
        <section className={styles.welcome}>
          <div className={styles.welcome__inner}>
            <h1 className={styles.welcome__title}>{t("welcome")}</h1>

            <div className={styles.login}>
              <div className={styles.login__container}>
                <Form
                  name="login"
                  style={{ maxWidth: 600 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                >
                  <Form.Item<LoginFormData>
                    name="email"
                    rules={[
                      { required: true, message: t("email-error") },
                      {
                        type: "email",
                        message: t("invalid-email"),
                      },
                    ]}
                  >
                    <Input placeholder={t("email")} />
                  </Form.Item>

                  <Form.Item<LoginFormData>
                    name="password"
                    hasFeedback
                    rules={[
                      { required: true, message: t("password-error") },
                      {
                        pattern:
                          /^(?=.*[a-zа-яё])(?=.*\d)(?=.*[@$!%*?&])[A-Za-zА-ЯЁа-яё\d@$!%*?&]{8,}$/,
                        message: t("invalid-password"),
                      },
                    ]}
                  >
                    <Input.Password placeholder={t("password")} />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      block
                      type="primary"
                      htmlType="submit"
                      className={styles.login__btn}
                    >
                      {t("login")}
                    </Button>
                  </Form.Item>
                </Form>
                <div>
                  <Link href={`/${localActive}/reset`} className={styles.link}>
                    {t("reset")}
                  </Link>
                </div>
                <div>
                  {t("question")}{" "}
                  <Link
                    href={`/${localActive}/register`}
                    className={styles.link}
                  >
                    {t("register")}
                  </Link>{" "}
                  {t("now")}.
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <Spinner />
      )}
    </>
  );
}
export default Login;
