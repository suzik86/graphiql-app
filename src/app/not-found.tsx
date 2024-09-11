"use client";

import NotFoundComponent from "../components/NotFound/NotFound";
import styles from "../theme/wrappers.module.scss";

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div className={styles.wrapper}>
          <div className={styles.content}>
            <NotFoundComponent />
          </div>
        </div>
      </body>
    </html>
  );
}
