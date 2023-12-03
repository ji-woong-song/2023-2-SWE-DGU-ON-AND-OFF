import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { Box, Container} from "@mui/material";
import { Business } from '@mui/icons-material';
import styles from "../Service.module.css";
import { requestAuthLogin } from "../../../../api/dguonandoff";
import { useNavigate } from "react-router-dom";
import { CookieStorageProvider } from "../../../../modules/storage/AppStorageProvider";

export default function LoginPage() {
    const navigate = useNavigate();

    const [userId, setUserId] = useState<string>("");
    const [userPw, setUserPw] = useState<string>("");

    const handleUserIdChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserId(event.target.value);
      };
    
      const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserPw(event.target.value);
      };

    const handleSubmit = async (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // 여기에서 로그인 로직 처리

        if (userId.length > 0 && userPw.length > 0) {
            const result = await requestAuthLogin(userId, userPw);
            switch (result.result) {
                case "LOGIN_SUCCESS": {
                    CookieStorageProvider.set("userAuthToken", result.token);
                    alert(`${userId}님 환영합니다.`);
                    navigate("/");
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
            if (userId.length === 0) errorInfo += "아이디를 입력하세요\n";
            if (userPw.length === 0) errorInfo += "비밀번호를 입력하세요\n";
            alert(errorInfo);

        }


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