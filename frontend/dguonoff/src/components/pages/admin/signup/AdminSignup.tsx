import { useNavigate } from "react-router-dom";
import styles from "./AdminSignup.module.css";
import { useState } from "react";
import { requestAuthSinUp } from "../../../../api/dguonandoff";


export default function AdminSignup() {
    // Const
    const navigate = useNavigate();


    // State
    const [id, setId] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordCheck, setPasswordCheck] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [sid, setSid] = useState<string>("");
    const [emailId, setEmailId] = useState<string>("");
    const [emailDomain, setEmaiDomain] = useState<string>("");


    // Handler
    const onSingUpClick = () => {
        if (id.length > 0 && password.length > 0 && password === passwordCheck && name.length > 0 && sid.length > 0 && emailId.length > 0 && emailDomain.length > 0) {
            //  const result = requestAuthSinUp(username, password);
            // TODO: reulst에 따라 홉페이지 이동 or 다시 로그인 시도
            navigate('/admin/login');
        } else {
            let errorInfo = "";
            if (id.length === 0) errorInfo += "아이디를 입력하세요\n";
            if (password.length === 0) errorInfo += "비밀번호를 입력하세요\n";
            if (password !== passwordCheck) errorInfo += "비밀번호 확인이 일치하지 않습니다\n";
            if (name.length === 0) errorInfo += "비밀번호를 입력하세요\n";
            if (sid.length === 0) errorInfo += "아이디를 입력하세요\n";
            if (emailId.length === 0) errorInfo += "비밀번호를 입력하세요\n";
            if (emailDomain.length === 0) errorInfo += "비밀번호를 입력하세요\n";
            alert(errorInfo);
        }
    };


    // Render
    return (<div className={styles.adminSignup}>
        <div className={styles.container}>
            <div className={styles.title}>회원가입</div>

            <div className={styles.login_info}>
                <label htmlFor="user-name">로그인 정보 입력</label>
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
                <input type="password" placeholder="비밀번호 확인" maxLength={50} onChange={(e) => {
                    const validValue = e.target.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"|,.<>?]+/g, '');
                    e.target.value = validValue;
                    setPasswordCheck(validValue);
                }} />
            </div>

            <div className={styles.user_info}>
                <label htmlFor="user-name">개인 정보 입력</label>
                <input type="text" placeholder="이름" maxLength={50} onChange={(e) => {
                    const validValue = e.target.value.replace(/[\d!@#$%^&*()_+\-=[\]{};':"|,.<>?/\\]+/g, '');
                    e.target.value = validValue;
                    setName(validValue);
                }} />
                <input type="text" placeholder="학번" maxLength={50} onChange={(e) => {
                    const validValue = e.target.value.replace(/[^0-9]+/g, '');
                    e.target.value = validValue;
                    setSid(validValue);
                }} />
                <div className={styles.email_form}>
                    <input type="text" placeholder="이메일" maxLength={50} onChange={(e) => {
                        setEmailId(e.target.value);
                    }} />
                    <label htmlFor="@">@</label>
                    <input type="text" placeholder="example.com" maxLength={50} onChange={(e) => {
                        setEmaiDomain(e.target.value);
                    }} />
                </div>

            </div>

            <div className={styles.signup_field}>
                <button onClick={onSingUpClick}>회원가입</button>
            </div>
        </div>
    </div>);
}