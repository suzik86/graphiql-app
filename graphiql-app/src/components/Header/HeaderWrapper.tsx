"use client";

import React, { useEffect, useState } from 'react';
import Header from './Header';
import EnglishFlag from '../../assets/flag_uk.png';
import RussianFlag from '../../assets/flag_ru.png';

const HeaderWrapper: React.FC = () => {
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [selectedFlag, setSelectedFlag] = useState<string>(RussianFlag);

  const handleScroll = () => {
    setIsSticky(window.scrollY > 0);
  };

  const handleMenuClick = (key: string) => {
    if (key === 'en') {
      setSelectedFlag(EnglishFlag);
    } else if (key === 'ru') {
      setSelectedFlag(RussianFlag);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Header 
      isSticky={isSticky} 
      selectedFlag={selectedFlag} 
      onMenuClick={handleMenuClick} 
    />
  );
};

export default HeaderWrapper;
