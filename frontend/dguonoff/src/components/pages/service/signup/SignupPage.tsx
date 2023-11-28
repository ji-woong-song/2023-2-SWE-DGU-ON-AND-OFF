import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { Box, Container} from "@mui/material";
import { Business } from '@mui/icons-material';
import styles from "../Service.module.css";

export default function SignupPage() {
    const [userId, setUserId] = useState<string>("");
    const [userPw, setUserPw] = useState<string>("");
    const [userName, setUsername] = useState<string>("");
    const [userSid, setUserSid] = useState<number>();
    const [userEmail, setUserEmail] = useState<string>("");

    const handleUserIdChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserId(event.target.value);
      };
    
    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserPw(event.target.value);
    };

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handleUserSidChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserSid(Number(event.target.value));
    };

    const handleUserEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserEmail(event.target.value);
    };

    const handleSubmit = (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // 여기에서 로그인 로직 처리
        console.log('UserId:', userId, 'userPw:', userPw);
      };

    return (
        <Container  sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding : '36px'
          }}>
            <div className={styles.mainTitle}>
                회원가입
            </div>
            <Box sx={{ height : 32 }}/>
            <Box component="form" onSubmit={handleSubmit}  sx={{ width: '100%'}}>
                <div className={styles.signupSubTitle}>로그인 정보 입력</div>
                <div>
                    <input className={styles.inputBox} type="text" placeholder="아이디" value={userId}
                    onChange={handleUserIdChange}/>
                </div>
                <div>
                    <input className={styles.inputBox} type="password" placeholder="비밀번호" value={userPw}
                    onChange={handlePasswordChange}/>
                </div>
                <Box sx={{ height : 32 }}/>
                <div className={styles.signupSubTitle}>개인 정보 입력</div>
                <div>
                    <input className={styles.inputBox} type="text" placeholder="이름" value={userName}
                    onChange={handleUsernameChange}/>
                </div>
                <div>
                    <input className={styles.inputBox} type="text" placeholder="학번" value={userSid}
                    onChange={handleUserSidChange}/>
                </div>
                <div>
                    <input className={styles.inputBox} type="text" placeholder="이메일" value={userEmail}
                    onChange={handleUserEmailChange}/>
                </div>
                <div>
                    <button className={styles.loginButton} type="submit">회원가입</button>
                </div>
            </Box>
        </Container>
    );
}