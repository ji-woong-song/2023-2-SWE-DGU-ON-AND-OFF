import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";
import { useState } from "react";
import { requestAuthLogin } from "../../../../api/dguonandoff";
import { CookieStorageProvider } from "../../../../modules/storage/AppStorageProvider";

export default function AdminLogin() {
    // Const
    const navigate = useNavigate();


    // State
    const [id, setId] = useState<string>("cat");
    const [password, setPassword] = useState<string>("123456789");


    // Handler
    const onLoginClick = async () => {
        if (id.length > 0 && password.length > 0) {
            const result = await requestAuthLogin(id, password);
            switch (result.result) {
                case "LOGIN_SUCCESS": {
                    CookieStorageProvider.set("userAuthToken", result.token);
                    alert(`${id}님 환영합니다.`);
                    navigate("/admin");
                    break;
                }
                case "LOGIN_FAIL": {
                    alert("없는 계정이거나 아이디 또는 비밀번호가 틀렸습니다.");
                    break;
                }
                default: {
                    alert("예기치 못한 오류로 로그인에 실패했습니다.");
                    break;
                }
            }
        } else {
            let errorInfo = "";
            if (id.length === 0) errorInfo += "아이디를 입력하세요\n";
            if (password.length === 0) errorInfo += "비밀번호를 입력하세요\n";
            alert(errorInfo);

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