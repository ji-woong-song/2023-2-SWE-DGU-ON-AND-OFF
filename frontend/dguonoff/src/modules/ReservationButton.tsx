// ReserveButton.tsx
import React from 'react';
import styles from './ReservationButton.module.css'; // CSS 모듈 가져오기

interface ReserveButtonProps {
  onClick?: () => void;
}

const ReserveButton: React.FC<ReserveButtonProps> = ({ onClick }) => {
  return (
    <div className={styles.reservationButtonContainer}>
      <button
        className={styles.reservationButton} // CSS 모듈 클래스 적용
        onClick={onClick}
      >
        예약하기
      </button>
    </div>
  );
};

export default ReserveButton;