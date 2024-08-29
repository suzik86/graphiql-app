"use client";
import { Button, Form, FormProps, Input } from "antd";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, registerWithEmailAndPassword } from "../../../firebase";
import styles from "./Register.module.scss";
import Spinner from "../../Spinner/Spinner";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

function Register() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const localActive = useLocale();
  const t = useTranslations("Register");

  const onFinish: FormProps<RegisterFormData>["onFinish"] = (values) => {
    registerWithEmailAndPassword(values.name, values.email, values.password);
  };

  useEffect(() => {   
    if (user) router.push(`/${localActive}/main`);
  }, [user, loading]);

  return (
    <>
      {!loading ? (
        <section className={styles.welcome}>
          <div className={styles.welcome__inner}>
            <h1 className={styles.welcome__title}>{t("title")}</h1>
            <div className={styles.register}>
              <div className={styles.register__container}>
                <Form
                  name="register"
                  style={{ maxWidth: 600 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                >
                  <Form.Item<RegisterFormData>
                    name="name"
                    rules={[{ required: true, message: t("name-error") }]}
                  >
                    <Input placeholder={t("name")} />
                  </Form.Item>
                  <Form.Item<RegisterFormData>
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

                  <Form.Item<RegisterFormData>
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
                    >
                      {t("register")}
                    </Button>
                  </Form.Item>
                </Form>
                <div>
                  {t("question")}{" "}
                  <Link href={`/${localActive}`} className={styles.link}>
                    {t("login")}
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
export default Register;
