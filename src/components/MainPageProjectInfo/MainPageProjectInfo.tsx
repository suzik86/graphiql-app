import Image from "next/image";
import styles from "./MainPageProjectInfo.module.scss";

interface MainProps {
  img1: string;
  img2: string;
  title: string;
}
const MainPageProjectInfo = ({ img1, img2, title }: MainProps) => {
  return (
    <section className={styles.info}>
      <div className={styles.info__inner}>
        <h2 className={styles.info__title}>{title}</h2>
        <div className={styles.info__images}>
          <Image src={img1} alt="project" className={styles.info__image} />
          <Image src={img2} alt="project" className={styles.info__image} />
        </div>
      </div>
    </section>
  );
};

export default MainPageProjectInfo;
