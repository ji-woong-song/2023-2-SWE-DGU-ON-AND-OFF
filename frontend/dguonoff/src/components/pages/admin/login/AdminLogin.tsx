import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";
import { useState } from "react";
import { requestAuthLogin } from "../../../../api/dguonandoff";

export default function AdminLogin() {
    // Const
    const navigate = useNavigate();


    // State
    const [id, setId] = useState<string>("");
    const [password, setPassword] = useState<string>("");


    // Handler
    const onLoginClick = async () => {
        if (id.length > 0 && password.length > 0) {
            const result = requestAuthLogin(id, password);
            // TODO: reulst에 따라 홉페이지 이동 or 다시 로그인 시도
            navigate("/admin");
        } else {
            (id.length === 0) && alert("아이디를 입력하세요");
            (password.length === 0) && alert("비밀번호를 입력하세요");
        }
    };

    const onSignUpClick = () => {
        navigate('/admin/signup');
    };


    // Render
    return (<div className={styles.adminLogin}>
        <div className={styles.container}>
            <div className={styles.logo}>
                <img src="/images/logo.gif" alt="Logo" />
            </div>
            <div className={styles.login_field}>
                <input type="text" placeholder="아이디" maxLength={50} onChange={(e) => {
                    const validValue = e.target.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"|,.<>?]+/g, '');
                    e.target.value = validValue;
                    setId(validValue);
                }} />
                <input type="password" placeholder="비밀번호" maxLength={50} onChange={(e) => {
                    const validValue = e.target.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"|,.<>?]+/g, '');
                    e.target.value = validValue;
                    setPassword(validValue);
                }} />
                <button onClick={onLoginClick}>로그인</button>
            </div>
            <div className={styles.signup_field}>
                <div className={styles.text}>동국 ON/OFF 사용이 처음이신가요?</div>
                <div className={styles.signup} onClick={onSignUpClick}>회원가입</div>
            </div>
        </div>
    </div>);
}