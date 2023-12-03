/*****************************************************************
 * 관리자 회원가입 페이지를 렌더링하고, 회원가입 기능을 제공하는 컴포넌트입니다.
 *****************************************************************/

import { useNavigate } from "react-router-dom";
import styles from "./AdminSignup.module.css";
import { useState } from "react";
import { requestAuthSinUp } from "../../../../api/dguonandoff";

/**
 * AdminSignup 컴포넌트는 관리자 회원가입을 위한 UI를 제공합니다.
 * 
 * 이 컴포넌트는 회원가입을 위한 아이디, 비밀번호, 비밀번호 확인, 이름, 학번, 전공, 이메일 입력 필드 및 회원가입 버튼을 제공합니다.
 * 사용자가 회원가입 버튼을 클릭하면, 입력된 정보로 회원가입을 시도하고 결과에 따라 다른 동작을 수행합니다.
 * 회원가입 성공 시, 로그인 페이지로 이동합니다.
 * 회원가입 실패 시, 오류 메시지를 표시합니다.
 * 입력 필드에는 유효성 검사를 적용하여, 유효하지 않은 입력을 방지합니다.
 * 
 * @returns {JSX.Element} 관리자 회원가입 페이지를 렌더링하는 JSX 엘리먼트입니다.
 */
export default function AdminSignup() {
    // Const
    const navigate = useNavigate();


    // State
    const [id, setId] = useState<string>("cat3");
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
            const { message } = await requestAuthSinUp(id, sid, name, major, password, `${emailId}@${emailDomain}`);
            switch (message) {
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