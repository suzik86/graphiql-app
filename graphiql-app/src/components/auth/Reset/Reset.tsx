"use client";
import { Button, Form, FormProps, Input } from "antd";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, sendPasswordReset } from "../../../firebase";
import styles from "./Reset.module.scss";
import Spinner from "../../Spinner/Spinner";

type ResetFormData = {
  email: string;
};

function Reset() {
  //const [user, loading, error] = useAuthState(auth);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const localActive = useLocale();
  const t = useTranslations("Reset");

  const onFinish: FormProps<ResetFormData>["onFinish"] = (values) => {
    sendPasswordReset(values.email);
  };

  useEffect(() => {
    if (user) router.push(`/${localActive}`);
  }, [user, loading, localActive]);

  return (
    <>
      {!loading ? (
        <section className={styles.welcome}>
          <div className={styles.welcome__inner}>
            <h1 className={styles.welcome__title}>{t("title")}</h1>
            <div className={styles.reset}>
              <div className={styles.reset__container}>
                <Form
                  name="reset"
                  style={{ maxWidth: 600 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                >
                  <Form.Item<ResetFormData>
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

                  <Form.Item>
                    <Button block type="primary" htmlType="submit">
                      {t("reset")}
                    </Button>
                  </Form.Item>
                </Form>
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
export default Reset;
