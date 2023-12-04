import axios from "axios";
import User, { UserRole } from "../types/User";
import { CookieStorageProvider } from "../modules/storage/AppStorageProvider";
import Building from "../types/Building";
import Facility from "../types/Facility";
import { Day } from "../types/Day";
import { FacilityEvent } from "../components/pages/admin/home/mainContent/commons/FacilityEventInfo";




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
 * 사용자의 인증 토큰을 쿠키에 저장하는 메서드입니다.
 *****************************************************************/

/**
 * setAuthToken 메서드는 사용자의 인증 토큰을 쿠키에 저장합니다.
 * 이 메서드는 주어진 토큰을 'authToken'이라는 이름으로 쿠키에 저장하는 역할을 합니다.
 * @param {string} token 사용자의 인증 토큰입니다.
 */
export function setAuthToken(token: string): void {
    CookieStorageProvider.set("authToken", token);
}




/*****************************************************************
 * 쿠키에서 사용자의 인증 토큰을 가져오는 메서드입니다.
 *****************************************************************/

/**
 * getAuthToken 메서드는 쿠키에서 'authToken'이라는 이름으로 저장된 사용자의 인증 토큰을 가져옵니다.
 * 이 메서드는 쿠키에 저장된 인증 토큰을 조회하고, 해당 토큰이 존재하면 그 값을 반환합니다.
 * 만약 토큰이 존재하지 않는 경우 undefined를 반환합니다.
 * @returns {string | undefined} 쿠키에 저장된 인증 토큰이 있으면 해당 토큰을, 없으면 undefined를 반환합니다.
 */
export function getAuthToken(): string | undefined {
    return CookieStorageProvider.get("authToken");
}




/*****************************************************************
 * 사용자의 역할을 쿠키에 저장하는 메서드입니다.
 *****************************************************************/

/**
 * setUserRole 메서드는 사용자의 역할을 쿠키에 저장합니다.
 * 이 메서드는 주어진 역할을 'userRole'이라는 이름으로 쿠키에 저장하는 역할을 합니다.
 * @param {UserRole} userRole 사용자의 역할입니다.
 */
export function setUserRole(userRole: UserRole): void {
    CookieStorageProvider.set("userRole", userRole);
}




/*****************************************************************
 * 쿠키에서 사용자의 역할을 가져오는 메서드입니다.
 *****************************************************************/

/**
 * getUserRole 메서드는 쿠키에서 'userRole'이라는 이름으로 저장된 사용자의 역할을 가져옵니다.
 * 이 메서드는 쿠키에 저장된 역할을 조회하고, 해당 역할이 존재하면 그 값을 반환합니다.
 * 만약 역할이 존재하지 않는 경우 undefined를 반환합니다.
 * @returns {UserRole | undefined} 쿠키에 저장된 사용자의 역할이 있으면 해당 역할을, 없으면 undefined를 반환합니다.
 */
export function getUserRole(): UserRole | undefined {
    const userRole = CookieStorageProvider.get("userRole");
    return userRole ? userRole as UserRole : undefined;
}




/*****************************************************************
 * 사용자의 로그인 요청을 처리하고 결과를 반환하는 API 메서드입니다.
 *****************************************************************/

/** 로그인 응답 데이터 타입 */
type AuthLoginResponse = {
    token: string;
    role: "NORMAL" | "ADMIN" | "MASTER";
} | {
    message: string;
    code: "LOGIN_FAIL" | "SERVER_ERROR";
};

/**
 * requestAuthLogin 메서드는 사용자의 ID와 비밀번호를 서버에 전송하여 로그인을 시도합니다.
 * 로그인 성공 시, 서버로부터 사용자의 토큰과 역할을 포함한 응답을 받습니다.
 * 로그인 실패 또는 서버 오류 발생 시, 오류 메시지와 오류 코드를 받습니다.
 * 
 * @param {string} id 사용자의 ID입니다.
 * @param {string} password 사용자의 비밀번호입니다.
 * @returns {Promise<{
 *   message: "LOGIN_SUCCESS" | "LOGIN_FAIL" | "SERVER_ERROR",
 *   data: {
 *     token: string,
 *     role: "NORMAL" | "ADMIN" | "MASTER"
 *   } | undefined
 * }>} 로그인 시도의 결과를 나타내는 객체를 반환합니다. 
 * 로그인 성공 시, 'data' 필드에 토큰과 역할이 포함되며, 실패 시 'data'는 undefined입니다.
 */
export async function requestAuthLogin(id: string, password: string): Promise<{
    message: "LOGIN_SUCCESS" | "LOGIN_FAIL" | "SERVER_ERROR";
    data: {
        token: string,
        role: "NORMAL" | "ADMIN" | "MASTER"
    } | undefined;
}> {
    let responseData: AuthLoginResponse | undefined = undefined;
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
        responseData = response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            responseData = error.response.data;
        }
    }
    return "token" in responseData! ? { message: "LOGIN_SUCCESS", data: responseData } : { message: responseData!.code, data: undefined };
}




/*****************************************************************
 * 사용자의 로그아웃 요청을 처리하는 메서드입니다.
 *****************************************************************/

/**
 * requestAuthLogout 메서드는 사용자의 로그아웃을 처리합니다.
 * 이 메서드는 사용자의 인증 토큰('authToken')과 사용자 역할('userRole')을 쿠키에서 제거함으로써 로그아웃을 수행합니다.
 * 로그아웃 이후, 사용자는 인증이 필요한 페이지나 기능에 접근할 수 없게 됩니다.
 */
export function requestAuthLogout(): void {
    CookieStorageProvider.remove("authToken");
    CookieStorageProvider.remove("userRole");
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
export async function requestAuthSinUp(id: string, sid: string, name: string, major: string, password: string, email: string): Promise<{ message: "SUCCESS" | "USER_ID_DUPLICATE" | "SERVER_ERROR" }> {
    let responseData: AuthSinUpResponse | undefined = undefined;
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
        responseData = response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            responseData = error.response.data;
        }
    }
    return responseData === "SUCCESS" ? { message: "SUCCESS" } : { message: responseData!.code };
}




/*****************************************************************
 * 서버로부터 모든 유저 정보를 조회하고 반환하는 API 메서드입니다.
 *****************************************************************/

/** 유저 정보 응답 데이터 타입 */
type UsersResponse = {
    sid: string;
    id: string;
    major: string;
    email: string;
    role: "NORMAL" | "ADMIN" | "MASTER";
}[];

/**
 * getUsers 메서드는 서버에 저장된 모든 사용자 정보를 조회합니다.
 * @param {string} token 현재 사용자의 인증 토큰입니다.
 * @returns {Promise<User[]>} 사용자 정보 객체 배열을 반환합니다. 
 * 각 객체에는 사용자의 학교 ID(sid), 고유 ID(id), 전공(major), 이메일(email), 역할(role)이 포함됩니다.
 * 에러 발생 시 빈 배열을 반환합니다.
 */
export async function getUsers(token: string): Promise<User[]> {
    let responseData: UsersResponse = [];
    try {
        const response = await axios.get(
            getApiUrl("/admin/master/users"),
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                withCredentials: true
            }
        );
        responseData = response.data;
    } catch (error) {
        console.error(error);
    }
    return responseData.map((user) => new User(user.id, user.sid, user.major, user.email, user.role));
}




/*****************************************************************
 * 지정된 유저에게 관리자 권한을 부여하는 API 메서드입니다.
 *****************************************************************/

/** 관리자 권한 부여 응답 데이터 타입 */
type EmpowermentResponse = string;

/**
 * requestEmpowerment 메서드는 지정된 유저에게 관리자 권한을 부여하는 요청을 서버에 보냅니다.
 * @param {string} token 현재 사용자의 인증 토큰입니다.
 * @param {string} userId 관리자 권한을 부여할 사용자의 ID입니다.
 * @returns {Promise<boolean>} 권한 부여 성공 여부를 반환합니다. 
 * 서버로부터 "권한이 부여됐습니다"라는 응답을 받으면 true, 그렇지 않으면 false를 반환합니다.
 */
export async function requestEmpowerment(token: string, userId: string): Promise<boolean> {
    let responseData: EmpowermentResponse = "";
    try {
        const postData = { userId };
        const response = await axios.post(
            getApiUrl("/admin/master/empowerment"),
            postData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
        );
        responseData = response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            responseData = error.response.data;
        }
    }
    return responseData.includes("권한이 부여됐습니다");
}




/*****************************************************************
 * 지정된 유저에게 관리자 권한을 박탈하는 API 메서드입니다.
 *****************************************************************/

/** 관리자 권한 박탈 응답 데이터 타입 */
type DeprivationResponse = string;

/**
 * requestDeprivation 메서드는 지정된 유저에게 관리자 권한을 박탈하는 요청을 서버에 보냅니다.
 * @param {string} token 현재 사용자의 인증 토큰입니다.
 * @param {string} userId 관리자 권한을 박탈할 사용자의 ID입니다.
 * @returns {Promise<boolean>} 권한 박탈 성공 여부를 반환합니다. 
 * 서버로부터 "권한이 박탈됐습니다"라는 응답을 받으면 true, 그렇지 않으면 false를 반환합니다.
 */
export async function requestDeprivation(token: string, userId: string): Promise<boolean> {
    let responseData: DeprivationResponse = "";
    try {
        const postData = { userId };
        const response = await axios.post(
            getApiUrl("/admin/master/deprivation"),
            postData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
        );
        responseData = response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            responseData = error.response.data;
        }
    }
    return responseData.includes("권한이 박탈됐습니다");
}




/**TODO: API명세가 필요함 */
export async function getReservations(token: string): Promise<void> {
    let responseData: any;
    try {
        const response = await axios.get(
            getApiUrl("/api/reservation/admin/all"),
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                withCredentials: true
            }
        );
        console.log(response.data)
        responseData = response.data;
    } catch (error) {
        console.error(error);
    }
}



/*****************************************************************
 * 서버로부터 건물 목록을 가져오는 API 메서드입니다.
 *****************************************************************/

/** 건물 응답 데이터 타입 */
type BuildingsResponse = {
    buildingName: string;
    maxFloor: number;
}[];

/**
 * getBuildings 메서드는 서버에 저장된 건물 정보를 조회합니다.
 * 이 메서드는 인증 토큰을 사용하여 서버에 요청을 보내고, 서버로부터 건물의 이름과 최대 층수 정보를 포함한 응답을 받습니다.
 * 
 * @param {string} token 현재 사용자의 인증 토큰입니다.
 * @returns {Promise<Building[]>} 서버로부터 받은 건물 정보를 Building 객체 배열로 반환합니다. 
 * 각 객체에는 건물의 이름(buildingName)과 최대 층수(maxFloor)가 포함됩니다.
 * 에러 발생 시 빈 배열을 반환합니다.
 */
export async function getBuildings(token: string): Promise<Building[]> {
    let responseData: BuildingsResponse = [];
    try {
        const response = await axios.get(
            getApiUrl("/api/building/"),
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                withCredentials: true
            }
        );
        responseData = response.data;
    } catch (error) {
        console.error(error);
    }
    return responseData.map((building) => new Building(building.buildingName, building.maxFloor));
}




/*****************************************************************
 * 서버로부터 특정 건물의 층별 시설 목록을 가져오는 API 메서드입니다.
 *****************************************************************/

/** 시설 응답 데이터 타입 */
type FacilitiesResponse = {
    floor: number;
    facility: {
        name: string;
        code: string;
        bookmarked: boolean;
        status: "EMPTY" | "USING";
        capacity: number;
    }[];
};

/**
 * getFacilities 메서드는 서버에 저장된 특정 건물의 층별 시설 정보를 조회합니다.
 * 이 메서드는 인증 토큰과 함께 건물의 이름 및 층수 정보를 서버에 요청하고, 서버로부터 해당 층의 시설 정보를 포함한 응답을 받습니다.
 * 
 * @param {string} token 현재 사용자의 인증 토큰입니다.
 * @param {number} floor 조회할 건물의 층수입니다.
 * @param {string} buildingName 조회할 건물의 이름입니다.
 * @returns {Promise<Facility[]>} 서버로부터 받은 시설 정보를 Facility 객체 배열로 반환합니다.
 * 각 객체에는 시설의 이름(name), 코드(code), 북마크 여부(bookmarked), 사용 상태(status), 수용 인원(capacity)이 포함됩니다.
 * 에러 발생 시 빈 배열을 반환합니다.
 */
export async function getFacilities(token: string, floor: number, buildingName: string): Promise<Facility[]> {
    let responseData: FacilitiesResponse = { floor: floor, facility: [] };
    try {
        const queryParams = new URLSearchParams({ floor: floor.toString(), buildingName }).toString();
        const response = await axios.get(
            getApiUrl(`/api/facility/?${queryParams}`),
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                withCredentials: true
            }
        );
        responseData = response.data;
    } catch (error) {
        console.error(error);
    }
    return responseData.facility.map((facility) => new Facility(facility.name, facility.code, facility.bookmarked, facility.status, facility.capacity));
}




export async function getFixedSchedules(token: string, day: Day, startDate: Date, endDate: Date, facility: Facility, building: Building): Promise<any> {
    let responseData: any;
    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const queryParams = new URLSearchParams({
        day: day,
        startDate: formatDate(startDate),
        endDate: formatDate(startDate),
        code: facility.getCode(),
        buildingName: building.getName()
    }).toString();

    try {
        const response = await axios.get(
            getApiUrl(`/api/fixedSchedules/?${queryParams}`),
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                withCredentials: true
            }
        );
        console.log(response.data)
        responseData = response.data;
    } catch (error) {
        console.error(error);
    }
    return responseData;
}


/*
{
  "facility": {
    "code": "string",
    "buildingName": "string"
  },
  "effectiveDate": {
    "start": "2023-12-03",
    "end": "2023-12-03"
  },
  "day": "MONDAY",
  "time": {
    "start": {
      "hour": 0,
      "minute": 0,
      "second": 0,
      "nano": 0
    },
    "end": {
      "hour": 0,
      "minute": 0,
      "second": 0,
      "nano": 0
    }
  },
  "event": {
    "name": "string",
    "hostName": "string",
    "outline": "string",
    "purpose": "string",
    "guestNumber": 0
  }
}
*/

export async function registerFixedSchedules(token: string, facility: Facility, building: Building, startDate: Date, endDate: Date, day: Day, time: Date, event: FacilityEvent): Promise<void> {
    let responseData: any;
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const formatTime = (date: Date) => {
        const newDate = new Date(date);
        newDate.setMinutes(date.getMinutes() + 30);
        return {
            start: { hour: date.getHours(), minute: date.getMinutes(), second: 0, nano: 0 },
            end: { hour: newDate.getHours(), minute: newDate.getMinutes(), second: 0, nano: 0 }
        }
    };

    try {
        const postData = {
            facility: {
                code: facility.getCode(),
                buildingName: building.getName()
            },
            effectiveDate: {
                start: formatDate(startDate),
                end: formatDate(endDate)
            },
            day: day,
            time: formatTime(time),
            event: event
        };
        console.log(postData)
        const response = await axios.post(
            getApiUrl("/api/fixedSchedules/"),
            postData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
        );
        console.log(response.data)
        responseData = response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            responseData = error.response.data;
        }
    }
}