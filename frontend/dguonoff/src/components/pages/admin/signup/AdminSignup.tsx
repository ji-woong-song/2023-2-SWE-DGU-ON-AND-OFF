import { useNavigate } from "react-router-dom";
import styles from "./AdminSignup.module.css";
import { useState } from "react";
import { requestAuthSinUp } from "../../../../api/dguonandoff";


export default function AdminSignup() {
    // Const
    const navigate = useNavigate();


    // State
    const [id, setId] = useState<string>("cat123123");
    const [password, setPassword] = useState<string>("123456789");
    const [passwordCheck, setPasswordCheck] = useState<string>("123456789");
    const [name, setName] = useState<string>("춘배");
    const [sid, setSid] = useState<string>("2018111111");
    const [major, setMajor] = useState<string>("컴퓨터공학전공");
    const [emailId, setEmailId] = useState<string>("cat");
    const [emailDomain, setEmaiDomain] = useState<string>("naver.com");


    // Handler
    const onSingUpClick = async () => {
        if (id.length > 0 && password.length > 0 && password === passwordCheck && name.length > 0 && sid.length > 0 && emailId.length > 0 && emailDomain.length > 0) {
            const result = await requestAuthSinUp(id, sid, name, major, password, `${emailId}@${emailDomain}`);
            switch (result) {
                case "SUCCESS": {
                    alert("회원가입에 성공하였습니다.");
                    navigate('/admin/login');
                    break;
                }
                case "USER_ID_DUPLICATE": {
                    alert("이미 사용중인 아이디입니다.");
                    setId("");
                    break;
                }
                default: {
                    alert("예기치 못한 오류로 회원가입에 실패했습니다.");
                    break;
                }
            }
        } else {
            let errorInfo = "";
            if (id.length === 0) errorInfo += "아이디를 입력하세요\n";
            if (password.length === 0) errorInfo += "비밀번호를 입력하세요\n";
            if (password !== passwordCheck) errorInfo += "비밀번호 확인이 일치하지 않습니다\n";
            if (name.length === 0) errorInfo += "이름을 입력하세요\n";
            if (sid.length === 0) errorInfo += "학번을 입력하세요\n";
            if (emailId.length === 0 || emailDomain.length === 0) errorInfo += "이메일을 입력하세요\n";
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
                <input type="text" placeholder="전공(선택 사항)" maxLength={50} onChange={(e) => {
                    setMajor(e.target.value);
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