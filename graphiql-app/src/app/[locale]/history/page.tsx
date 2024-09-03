import { useTranslations } from "next-intl";

export default function HistoryPage() {
  const t = useTranslations("History");
  return (
    <>
      <h1 style={{ textAlign: "center" }}>{t("title")}</h1>
    </>
  );
}
