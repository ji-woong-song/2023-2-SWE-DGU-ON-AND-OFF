import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { Box, Container, IconButton, Toolbar, Button, TextField } from "@mui/material";
import { Business } from '@mui/icons-material';
import styles from "../Service.module.css";
import ReservationButton from "../../../../modules/reservationButton/ReservationButton";

export default function LoginPage() {
    const [userId, setUserId] = useState<string>("");
    const [userPw, setUserPw] = useState<string>("");

    const handleUserIdChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserId(event.target.value);
      };
    
      const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserPw(event.target.value);
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
            <Business sx={{ color: '#FBAF3E', fontSize: '56px', paddingBottom : '14px' }}/>
            <div className={styles.mainTitle}>
                동국 ON/OFF
            </div>
            <Box sx={{ height : 80 }}/>
            <Box component="form" onSubmit={handleSubmit}  sx={{ width: '100%'}}>
                <div>
                    <input className={styles.inputBox} type="text" placeholder="아이디" value={userId}
                    onChange={handleUserIdChange}/>
                </div>
                <div>
                    <input className={styles.inputBox} type="password" placeholder="비밀번호" value={userPw}
                    onChange={handlePasswordChange}/>
                </div>
                <div>
                    <button className={styles.loginButton} type="submit">로그인</button>
                </div>
            </Box>
            <div className={styles.firstUse}>
                동국 ON/OFF 사용이 처음이신가요? <a href="/signup" className={styles.signupHref}>회원가입</a>
            </div>
        </Container>
    );
}