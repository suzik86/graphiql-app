"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "./Header";

const HeaderWrapper: React.FC = () => {
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleScroll = () => {
    setIsSticky(window.scrollY > 0);
  };

  const handleMenuClick = (key: string) => {
    const currentPath = pathname.slice(3);
    router.replace(`/${key}/${currentPath}`);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return <Header isSticky={isSticky} onMenuClick={handleMenuClick} />;
};

export default HeaderWrapper;
