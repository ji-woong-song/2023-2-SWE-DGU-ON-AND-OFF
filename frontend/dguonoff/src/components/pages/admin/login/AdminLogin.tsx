import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";

export default function AdminLogin() {
    // Const
    const navigate = useNavigate();


    // Handler
    const onLoginClick = () => {
        navigate('/admin');
    };

    const onSignupClick = () => {
        navigate('/admin/signup');
    };


    // Render
    return (<div className={styles.adminLogin}>
        <div className={styles.container}>
            <div className={styles.logo}>
                <img src="/images/logo.gif" alt="Logo" />
            </div>
            <div className={styles.login_field}>
                <input type="text" placeholder="아이디" maxLength={50} />
                <input type="text" placeholder="비밀번호" maxLength={50} />
                <button onClick={onLoginClick}>로그인</button>
            </div>
            <div className={styles.signup_field}>
                <div className={styles.text}>동국 ON/OFF 사용이 처음이신가요?</div>
                <div className={styles.signup} onClick={onSignupClick}>회원가입</div>
            </div>
        </div>
    </div>);
}