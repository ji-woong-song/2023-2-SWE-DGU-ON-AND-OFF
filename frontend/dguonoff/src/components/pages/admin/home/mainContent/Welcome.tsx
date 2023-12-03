/*****************************************************************
 * 환영 메시지와 로고를 표시하는 컴포넌트입니다.
 *****************************************************************/

import styles from "./Welcome.module.css";

/**
 * Welcome 컴포넌트는 사용자에게 로고와 함께 환영 메시지를 보여줍니다.
 * 
 * 이 컴포넌트는 로고 이미지를 중앙에 표시하며, 사용자가 애플리케이션의 첫 화면에서 볼 수 있는 간단한 인터페이스를 제공합니다.
 * 로고 이미지는 '/images/logo.gif' 경로에서 가져옵니다.
 * 
 * @returns {JSX.Element} 로고 이미지를 포함한 환영 메시지를 렌더링하는 JSX 엘리먼트입니다.
 */
export default function Welcome() {
    return (
        <div className={styles.welcome}>
            <img src="/images/logo.gif" alt="Logo" />
        </div>
    )
}
