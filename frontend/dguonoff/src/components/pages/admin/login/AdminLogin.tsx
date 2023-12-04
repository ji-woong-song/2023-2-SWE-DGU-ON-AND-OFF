/*****************************************************************
 * 관리자 로그인 페이지를 렌더링하고, 로그인 기능을 제공하는 컴포넌트입니다.
 *****************************************************************/

import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";
import { useState } from "react";
import { requestAuthLogin, setAuthToken, setUserRole } from "../../../../api/dguonandoff";

/**
 * AdminLogin 컴포넌트는 관리자 로그인을 위한 UI를 제공합니다.
 * 
 * 이 컴포넌트는 로그인을 위한 아이디와 비밀번호 입력 필드, 로그인 버튼, 회원가입 페이지로의 링크를 제공합니다.
 * 사용자가 로그인 버튼을 클릭하면, 입력된 아이디와 비밀번호로 로그인을 시도하고 결과에 따라 다른 동작을 수행합니다.
 * 로그인 성공 시, 사용자 역할에 따라 적절한 페이지로 이동하거나 접근 제한 메시지를 표시합니다.
 * 로그인 실패 시, 오류 메시지를 표시합니다.
 * 
 * 또한, 사용자가 회원가입 링크를 클릭하면 회원가입 페이지로 이동합니다.
 * 
 * @returns {JSX.Element} 관리자 로그인 페이지를 렌더링하는 JSX 엘리먼트입니다.
 */
export default function AdminLogin() {
    // Const
    const navigate = useNavigate();


    // State
    const [id, setId] = useState<string>("root");
    const [password, setPassword] = useState<string>("password");


    // Handler
    const onLoginClick = async () => {
        if (id.length > 0 && password.length > 0) {
            const { message, data } = await requestAuthLogin(id, password);
            switch (message) {
                case "LOGIN_SUCCESS": {
                    if (data) {
                        if (data.role === "NORMAL") {
                            alert("관리자만 접근할 수 있는 페이지 입니다.");
                        } else {
                            setAuthToken(data.token);
                            setUserRole(data.role);
                            alert(`${id}(${data!.role})님 환영합니다.`);
                            navigate("/admin");
                        }
                    } else {
                        alert("예기치 못한 오류로 로그인에 실패했습니다.");
                    }
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