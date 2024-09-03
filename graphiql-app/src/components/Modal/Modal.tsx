"use client";
import styles from "./Modal.module.scss";
import React, { useState } from "react";
import { Button, Modal } from "antd";

const ModalComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        style={{ backgroundColor: "#7D81D6", borderColor: "#7D81D6" }}
      >
        Open Modal
      </Button>
      <Modal
       // title={<span className={styles.modal__title}>Oooops...</span>}
        open={isModalOpen}
        onOk={handleOk}
        okText="Try again"
        onCancel={handleOk}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{
          style: { backgroundColor: "#7D81D6", borderColor: "#7D81D6" },
        }}
      >
        <div className={styles.modal__header}>
          ffb
        </div>
        <p className={styles.modal__text}>Something went wrong...</p>
      </Modal>
    </>
  );
};

export default ModalComponent;
