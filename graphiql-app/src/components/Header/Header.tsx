// Header.tsx

import React from "react";
import Image from "next/image";
import styles from "./Header.module.scss";
import team_logo from "../../assets/team_logo.png";
import { Dropdown, Space } from "antd";
import type { MenuProps } from "antd";
import HeaderButton from "../HeaderButton/HeaderButton";
import EnglishFlag from "../../assets/flag_uk.png";
import RussianFlag from "../../assets/flag_ru.png";

interface HeaderProps {
  isSticky: boolean;
  selectedFlag: string;
  onMenuClick: (key: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  isSticky,
  selectedFlag,
  onMenuClick,
}) => {
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
        <div className={styles.header__logo}>
          <Image src={team_logo} alt="team_logo" />
        </div>
        <div className={styles.header__controls}>
          <Space wrap>
            <Dropdown menu={{ items, onClick: ({ key }) => onMenuClick(key) }}>
              <div className={styles.header__languageDropdown}>
                <Image src={selectedFlag} alt="Selected Language" />
              </div>
            </Dropdown>
          </Space>
          <HeaderButton to="#" text="Sign Out" />
        </div>
      </div>
    </header>
  );
};

export default Header;
