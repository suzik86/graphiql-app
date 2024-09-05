"use client";
import React from "react";
import RestClient from "../../../../components/RestClient/RestClient";
import styles from "./page.module.scss";

const RestClientPage: React.FC = () => {
  return (
    <main className={styles.content__theme}>
      <RestClient />
    </main>
  );
};

export default RestClientPage;
