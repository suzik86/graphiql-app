// src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import styles from './Header.module.css'; // Импорт стилей

const Header: React.FC = () => {
  const [isSticky, setIsSticky] = useState<boolean>(false);

  const handleScroll = () => {
    setIsSticky(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`${styles.header} ${isSticky ? styles.sticky : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>[Logo]</div>
        <div className={styles.controls}>
          <button className={styles.languageToggle}>Language</button>
          <button className={styles.signOut}>Sign Out</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
