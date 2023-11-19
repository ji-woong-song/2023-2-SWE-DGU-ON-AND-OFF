import { useNavigate } from "react-router-dom";
import styles from "./AdminSignup.module.css";


export default function AdminSignup() {
    // Const
    const navigate = useNavigate();


    // Handler
    const onSingupClick = () => {
        navigate('/admin/login');
    };


    // Render
    return (<div className={styles.adminSignup}>
        <div className={styles.container}>
            <div className={styles.title}>회원가입</div>

            <div className={styles.login_info}>
                <label htmlFor="user-name">로그인 정보 입력</label>
                <input type="text" placeholder="아이디" maxLength={50} />
                <input type="text" placeholder="비밀번호" maxLength={50} />
                <input type="text" placeholder="비밀번호 확인" maxLength={50} />
            </div>

            <div className={styles.user_info}>
                <label htmlFor="user-name">개인 정보 입력</label>
                <input type="text" placeholder="이름" maxLength={50} />
                <input type="text" placeholder="학번" maxLength={50} />
                <input type="text" placeholder="이메일" maxLength={50} />
            </div>

            <div className={styles.signup_field}>
                <button onClick={onSingupClick}>회원가입</button>
            </div>
        </div>
    </div>);
}