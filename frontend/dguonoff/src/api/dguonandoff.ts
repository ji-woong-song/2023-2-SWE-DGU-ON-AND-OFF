import axios from "axios";
import qs from 'qs';



/**
 * getApiUrl 메서드는 사용자의 역할에 따라 API의 기본 URL을 결정하고, API 경로를 추가하여 완성된 API URL을 반환합니다.
 * @param path API 경로입니다.
 * @returns {string} 구성된 API URL을 반환합니다.
 */
function getApiUrl(path: string): string {
    const baseUrl = `https://blindroute-springboot.koyeb.app${path}`;
    const now = new Date();
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}:${now.getMilliseconds().toString().padStart(3, '0')}`;
    console.log(`[${formattedTime}] request: ${baseUrl}`);
    return baseUrl;
}



/** 로그인 */
export async function requestAuthLogin(id: string, password: string): Promise<any> {
    let result: any = null;
    try {
        const postData = qs.stringify({ id, password });
        const response = await axios.post(
            getApiUrl("/auth/login"),
            postData,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"  //'Bearer [token]'
                },
                withCredentials: true
            }
        );
        result = response.data;
    } catch (error) {
        console.error("인증 요청 실패:", error);
    }
    return result;
}


export async function requestAuthSinUp(id: string, sid: string, name: string, password: string, email: string): Promise<any> {
    let result: any = null;
    try {
        const postData = qs.stringify({ id, sid, name, password, email });
        const response = await axios.post(
            getApiUrl("/auth/signUp"),
            postData,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"  //'Bearer [token]'
                },
                withCredentials: true
            }
        );
        result = response.data;
    } catch (error) {
        console.error("가입 요청 실패:", error);
    }
    return result;
}




