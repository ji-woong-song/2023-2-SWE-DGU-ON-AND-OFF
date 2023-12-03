import axios from "axios";
import Bookmark from "../types/Bookmark";




/*****************************************************************
 * API URL을 구성하고 반환하는 메서드입니다.
 *****************************************************************/

/**
 * getApiUrl 메서드는 API의 기본 URL을 결정하고, API 경로를 추가하여 완성된 API URL을 반환합니다.
 * @param path API 경로입니다.
 * @returns {string} 구성된 API URL을 반환합니다.
 */
function getApiUrl(path: string): string {
    const baseUrl = `http://3.37.162.40:8080${path}`;
    const now = new Date();
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}:${now.getMilliseconds().toString().padStart(3, '0')}`;
    console.log(`[${formattedTime}] request: ${baseUrl}`);   // 디버깅용 콘솔
    return baseUrl;
}




/*****************************************************************
 * 사용자의 로그인 요청을 처리하고 결과를 반환하는 API 메서드입니다.
 *****************************************************************/

/** 로그인 응답 데이터 타입 */
type AuthLoginResponse = { token: string } | {
    message: string;
    code: "LOGIN_FAIL" | "SERVER_ERROR";
};

/**
 * requestAuthLogin 메서드는 서버에 로그인 요청을 보냅니다.
 * @param id 사용자의 아이디입니다.
 * @param password 사용자의 비밀번호입니다.
 * @returns {Promise<{ result: "LOGIN_SUCCESS" | "LOGIN_FAIL" | "SERVER_ERROR", token: string }>}
 * 로그인 요청의 성공 여부와 토큰을 반환합니다.
 * "LOGIN_SUCCESS"는 로그인 성공, "LOGIN_FAIL"은 로그인 실패, "SERVER_ERROR"는 서버 오류를 나타냅니다.
 * 성공 시, JWT 토큰을 반환하고, 실패 시 빈 문자열을 반환합니다.
 */
export async function requestAuthLogin(id: string, password: string): Promise<{ result: "LOGIN_SUCCESS" | "LOGIN_FAIL" | "SERVER_ERROR", token: string }> {
    let result: AuthLoginResponse | undefined = undefined;
    try {
        const postData = { id, password };
        const response = await axios.post(
            getApiUrl("/auth/login"),
            postData,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
        );
        result = response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            result = error.response.data;
        }
    }
    return "token" in result! ? { result: "LOGIN_SUCCESS", token: result.token } : { result: result!.code, token: "" };
}




/*****************************************************************
 * 사용자의 회원가입 요청을 처리하고 결과를 반환하는 API 메서드입니다.
 *****************************************************************/

/** 회원가입 응답 데이터 타입 */
type AuthSinUpResponse = "SUCCESS" | {
    message: string;
    code: "USER_ID_DUPLICATE" | "SERVER_ERROR";
};

/**
 * requestAuthSinUp 메서드는 서버에 회원가입 요청을 보냅니다.
 * @param id 사용자의 아이디입니다.
 * @param sid 사용자의 학번 또는 직원 번호입니다.
 * @param name 사용자의 이름입니다.
 * @param major 사용자의 전공 또는 부서명입니다.
 * @param password 사용자의 비밀번호입니다.
 * @param email 사용자의 이메일 주소입니다.
 * @returns {Promise<"SUCCESS" | "USER_ID_DUPLICATE" | "SERVER_ERROR">} 
 * 회원가입 요청의 성공 여부를 문자열로 반환합니다. 
 * "SUCCESS"는 성공, "USER_ID_DUPLICATE"는 중복된 아이디, "SERVER_ERROR"는 서버 오류를 나타냅니다.
 */
export async function requestAuthSinUp(id: string, sid: string, name: string, major: string, password: string, email: string): Promise<"SUCCESS" | "USER_ID_DUPLICATE" | "SERVER_ERROR"> {
    let result: AuthSinUpResponse | undefined = undefined;
    try {
        const postData = { id, sid, name, major, password, email };
        const response = await axios.post(
            getApiUrl("/auth/signUp"),
            postData,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
        );
        result = response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            result = error.response.data;
        }
    }
    return result === "SUCCESS" ? result : result!.code;
}




// TODO: API 구현이 변경될 예정
/*****************************************************************
 * 서버로부터 건물 이름 목록을 가져오는 API 메서드입니다.
 *****************************************************************/

/** 건물 이름 응답 데이터 타입 */
type BuildingNamesResponse = {
    buildingNames: string[];
};

/**
 * getBuildingNames 메서드는 서버에 건물 이름 목록 요청을 보냅니다.
 * 이 함수는 로그인 후 받은 토큰을 사용하여 인증된 요청을 서버로 보냅니다.
 * 
 * @param token 사용자 인증을 위한 JWT 토큰입니다.
 * @returns {Promise<string[]>} 서버로부터 받은 건물 이름 목록을 반환합니다.
 * 성공 시 건물 이름 배열을 반환하고, 실패 시 빈 배열을 반환합니다.
 */
export async function getBuildingNames(token: string): Promise<string[]> {
    let result: BuildingNamesResponse = { buildingNames: [] };
    try {
        const response = await axios.get(
            getApiUrl("/api/building/names"),
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                withCredentials: true
            }
        );
        result = response.data;
    } catch (error) {
        console.error(error);
    }
    return result.buildingNames;
}



//http://3.37.162.40:8080
// TODO: 아직 API 구현이 안되어있음
export async function getFacilities(token: string): Promise<string[]> {
    let result: any;
    try {
        const response = await axios.get(
            getApiUrl("/api/facility/1/신공학관"),
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                withCredentials: true
            }
        );
        result = response.data;
    } catch (error) {
        console.error(error);
    }
    console.log(result);
    return result;
}


export async function getMyBookmark(token: string): Promise<Bookmark[]> {
    let result: Bookmark[] = [];
    try {
        const response = await axios.get(
            getApiUrl("/api/user/bookmark"),
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        console.log(response.data);
        result = response.data.map((item: any) => new Bookmark(item.facilityName, item.facilityCode, item.buildingName));
    } catch (error) {
        console.error(error);
    }
    return result;
}