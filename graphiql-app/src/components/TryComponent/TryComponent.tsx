import Button from "./Button/Button";
import NavigateButton from "./NavigateButton/NavigateButton";
import styles from "./TryComponent.module.scss";
import { methods } from "./consts";
const TryComponent = () => {
  return (
    <section className={styles.try}>
      <div className={styles.try__inner}>
        <NavigateButton />
      </div>
      {methods.map((item) => (
        <Button
          text={item.method}
          color={item.color}
          top={item.top}
          left={item.left}
          right={item.right}
          bottom={item.bottom}
          rotate={item.rotate}
        />
      ))}
     
    </section>
  );
};

export default TryComponent;
