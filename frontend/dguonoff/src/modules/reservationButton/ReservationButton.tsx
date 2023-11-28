// ReserveButton.tsx
import React from 'react';
import styles from "./ReservationButton.module.css"; // CSS 모듈 가져오기

interface ReservationButtonProps {
  onClick?: () => void;
}

const ReservationButton: React.FC<ReservationButtonProps> = ({ onClick }) => {
  return (
    <div className={styles.reservationButtonContainer}>
      <button
        className={styles.reservationButton} // CSS 모듈 클래스 적용
        onClick={onClick}
      />
        예약하기
    </div>
  );
};

export default ReservationButton;