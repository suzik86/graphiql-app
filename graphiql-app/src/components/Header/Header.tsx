import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import RussianFlag from "../../assets/flag_ru.png";
import EnglishFlag from "../../assets/flag_uk.png";
import team_logo from "../../assets/team_logo.png";
import { auth, logout } from "../../firebase";
import HeaderButton from "../HeaderButton/HeaderButton";
import styles from "./Header.module.scss";

interface HeaderProps {
  isSticky: boolean;
  onMenuClick: (key: string) => void;
}

const Header: FC<HeaderProps> = ({ isSticky, onMenuClick }) => {
  const localActive = useLocale();
  const t = useTranslations("Header");
  const selectedFlag = localActive === "en" ? EnglishFlag : RussianFlag;
  const [user] = useAuthState(auth);

  const items: MenuProps["items"] = [
    {
      label: (
        <div className={styles.header__dropdownItem}>
          <Image src={EnglishFlag} alt="English" />
          En
        </div>
      ),
      key: "en",
    },
    {
      label: (
        <div className={styles.header__dropdownItem}>
          <Image src={RussianFlag} alt="Russian" />
          Ru
        </div>
      ),
      key: "ru",
    },
  ];

  return (
    <header className={`${styles.header} ${isSticky ? styles.sticky : ""}`}>
      <div className={styles.header__container}>
        <Link href={`/${localActive}`} className={styles.header__logo}>
          <Image src={team_logo} alt="team_logo" />
        </Link>
        <div className={styles.header__controls}>
          <Space wrap>
            <Dropdown menu={{ items, onClick: ({ key }) => onMenuClick(key) }}>
              <div className={styles.header__languageDropdown}>
                <Image src={selectedFlag} alt="Selected Language" />
              </div>
            </Dropdown>
          </Space>
          {user && (
            <button className={styles.logout__btn} onClick={logout}>
              {t("sign-out")}
            </button>
          )}
          {!user && (
            <HeaderButton to={`/${localActive}/login`} text={t("sign-in")} />
          )}
          {!user && (
            <HeaderButton to={`/${localActive}/register`} text={t("sign-up")} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
