import axios from "axios";
import Bookmark from "../types/Bookmark";
import User, { UserRole } from "../types/User";
import { CookieStorageProvider } from "../modules/storage/AppStorageProvider";
import Building from "../types/Building";
import Facility from "../types/Facility";
import { Day } from "../types/Day";
import FacilitySchedule from "../types/FacilitySchedule";
import { FacilityEvent } from "../types/FacilityEvent";
import Reservation from "../types/Reservation";
import Announcement from "../types/Announcement";




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
            getApiUrl("/api/master/users"),
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
    return responseData.map((user) => new User(user.id, user.sid, undefined, user.major, user.email, user.role));
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
            getApiUrl("/api/master/users/empowerment"),
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
            getApiUrl("/api/master/users/deprivation"),
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




/*****************************************************************
 * 서버로부터 모든 예약 정보를 가져오는 API 메서드입니다.
 * 이 메서드는 관리자에게만 사용 가능합니다.
 *****************************************************************/

/** 예약 요청리스트 응답 데이터 타입 */
type GetReservationsResponse = {
    reservationId: number;
    title: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    date: string;
    startTime: string;
    endTime: string;
    facilityCode: string;
    buildingName: string;
    facilityName: string;
    facilityState: "EMPTY" | "USING";
    outline: string;
    purpose: string;
    host: {
        id: string;
        role: "NORMAL" | "ADMIN" | "MASTER";
        sid: string;
        name: string;
        major: string | null;
        email: string;
    };
    guests: { id: string; name: string; }[];
}[];

/**
 * getReservations 메서드는 관리자가 모든 예약 정보를 조회하기 위해 서버에 요청합니다.
 * 이 메서드는 인증 토큰을 사용하여 관리자 권한을 인증받고, 서버로부터 예약 목록을 받아옵니다.
 *
 * @param {string} token 현재 사용자의 인증 토큰입니다.
 * @returns {Promise<Reservation[]>} 서버로부터 받은 예약 정보를 Reservation 객체 배열로 반환합니다.
 * 각 객체에는 예약 ID, 제목, 상태, 날짜, 시작 및 종료 시간, 시설 코드, 건물 이름, 시설 이름, 개요, 목적, 게스트 목록이 포함됩니다.
 * 에러 발생 시 빈 배열을 반환합니다.
 */
export async function getReservations(token: string): Promise<Reservation[]> {
    let responseData: GetReservationsResponse = [];
    try {
        const response = await axios.get(
            getApiUrl("/api/admin/reservation/all"),
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
    return responseData.map((reservations) => new Reservation(
        reservations.reservationId,
        reservations.title,
        reservations.status,
        reservations.date,
        reservations.startTime,
        reservations.endTime,
        reservations.facilityCode,
        reservations.buildingName,
        reservations.facilityName,
        "EMPTY",
        reservations.outline,
        reservations.purpose,
        new User(reservations.host.id, reservations.host.sid, reservations.host.name, reservations.host.major || "", reservations.host.email, reservations.host.role),
        reservations.guests));
}




/*****************************************************************
 * 관리자가 특정 예약을 승인하는 API 메서드입니다.
 * 이 메서드는 관리자에게만 사용 가능합니다.
 *****************************************************************/

/** 예약 승인 응답 데이터 타입 */
type ApproveReservationResponse = string | {
    message: string;
    code: string;
};

/**
 * approveReservation 메서드는 관리자가 특정 예약을 승인하기 위해 서버에 요청합니다.
 * 이 메서드는 인증 토큰과 예약 객체를 사용하여 서버에 예약 승인 요청을 보냅니다.
 *
 * @param {string} token 현재 사용자의 인증 토큰입니다.
 * @param {Reservation} reservation 승인할 예약 객체입니다.
 * @returns {Promise<boolean>} 예약 승인이 성공적으로 완료되었는지 여부를 반환합니다.
 * 서버로부터 "예약 승인이 완료되었습니다"라는 응답을 받으면 true, 그렇지 않으면 false를 반환합니다.
 */
export async function approveReservation(token: string, reservation: Reservation): Promise<boolean> {
    let responseData: ApproveReservationResponse = "";
    try {
        const response = await axios.get(
            getApiUrl(`/api/admin/reservation/approval/${reservation.getReservationId()}`),
            {
                headers: {
                    "Authorization": `Bearer ${token}`
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
    return typeof responseData === "string" && responseData.includes("예약 승인이 완료되었습니다");
}




/*****************************************************************
 * 관리자가 특정 예약을 거절하는 API 메서드입니다.
 * 이 메서드는 관리자에게만 사용 가능합니다.
 *****************************************************************/

/** 예약 거절 응답 데이터 타입 */
type RejectReservationResponse = string | {
    message: string;
    code: string;
};

/**
 * rejectReservation 메서드는 관리자가 특정 예약을 거절하기 위해 서버에 요청합니다.
 * 이 메서드는 인증 토큰과 예약 객체를 사용하여 서버에 예약 거절 요청을 보냅니다.
 *
 * @param {string} token 현재 사용자의 인증 토큰입니다.
 * @param {Reservation} reservation 거절할 예약 객체입니다.
 * @returns {Promise<boolean>} 예약 거절이 성공적으로 완료되었는지 여부를 반환합니다.
 * 서버로부터 "예약 거절이 완료되었습니다"라는 응답을 받으면 true, 그렇지 않으면 false를 반환합니다.
 */
export async function rejectReservation(token: string, reservation: Reservation): Promise<boolean> {
    let responseData: RejectReservationResponse = "";
    try {
        const response = await axios.get(
            getApiUrl(`/api/admin/reservation/reject/${reservation.getReservationId()}`),
            {
                headers: {
                    "Authorization": `Bearer ${token}`
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
    return typeof responseData === "string" && responseData.includes("예약 거절이 완료되었습니다");
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




/*****************************************************************
 * 서버로부터 특정 요일에 특정 시설과 건물에서의 고정 일정 목록을 가져오는 API 메서드입니다.
 *****************************************************************/

/** 고정 일정 응답 데이터 타입 */
type GetFixedSchedulesResponse = {
    id: number;
    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
    time: {
        start: string;
        end: string;
    };
    event: {
        name: string;
        hostName: string;
        outline: string;
        purpose: string;
        guestNumber: number;
    };
}[];

/**
 * getFixedSchedules 메서드는 서버에 저장된 특정 시설의 특정 기간에 대한 고정 일정 정보를 조회합니다.
 * 이 메서드는 인증 토큰과 함께 요일, 시작/종료 날짜, 시설 객체, 건물 객체를 서버에 요청하고,
 * 서버로부터 해당 조건을 만족하는 고정 일정 정보를 포함한 응답을 받습니다.
 * 
 * @param {string} token 현재 사용자의 인증 토큰입니다.
 * @param {Day} day 조회할 요일입니다.
 * @param {Date} startDate 조회할 시작 날짜입니다.
 * @param {Date} endDate 조회할 종료 날짜입니다.
 * @param {Facility} facility 조회할 시설 객체입니다.
 * @param {Building} building 조회할 건물 객체입니다.
 * @returns {Promise<FacilitySchedule[]>} 서버로부터 받은 고정 일정 정보를 FacilitySchedule 객체 배열로 반환합니다.
 * 각 객체에는 일정의 ID, 요일, 시간(start, end), 이벤트(name, hostName, outline, purpose, guestNumber)가 포함됩니다.
 * 에러 발생 시 빈 배열을 반환합니다.
 */
export async function getFixedSchedules(token: string, day: Day, startDate: Date, endDate: Date, facility: Facility, building: Building): Promise<FacilitySchedule[]> {
    let responseData: GetFixedSchedulesResponse = [];

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const stringToTime = (timeStr: string): Date => {
        const [hours, minutes, seconds] = timeStr.split(":").map(Number);
        const time = new Date();
        time.setHours(hours, minutes, seconds, 0);
        return time;
    };

    const queryParams = new URLSearchParams({
        day: day,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        code: facility.getCode(),
        buildingName: building.getName()
    }).toString();

    try {
        const response = await axios.get(
            getApiUrl(`/api/admin/fixedSchedules/?${queryParams}`),
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                withCredentials: true
            }
        );
        responseData = response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            responseData = [];
        }
    }

    return responseData.map((fixedSchedule) => new FacilitySchedule(
        fixedSchedule.id,
        stringToTime(fixedSchedule.time.start),
        stringToTime(fixedSchedule.time.end),
        new FacilityEvent(fixedSchedule.event.name, fixedSchedule.event.hostName, fixedSchedule.event.outline, fixedSchedule.event.purpose, fixedSchedule.event.guestNumber)
    ));
}




/*****************************************************************
 * 서버에 새로운 고정 일정을 등록하는 API 메서드입니다.
 *****************************************************************/

/** 고정 일정 등록 응답 데이터 타입 */
type RegisterFixedScheduleResponse = {
    scheduleId: number;
} | {
    message: string;
    code: string;
};

/**
 * registerFixedSchedule 메서드는 새 고정 일정을 서버에 등록합니다.
 * 이 메서드는 인증 토큰과 함께 시설, 건물, 시작/종료 날짜, 요일, 시작/종료 시간, 이벤트 정보를 포함한 데이터를 서버에 전송합니다.
 * 성공적으로 일정이 등록되면, 서버로부터 할당된 일정 ID를 받습니다.
 * 
 * @param {string} token 현재 사용자의 인증 토큰입니다.
 * @param {Facility} facility 등록할 시설 객체입니다.
 * @param {Building} building 등록할 건물 객체입니다.
 * @param {Date} startDate 일정의 시작 날짜입니다.
 * @param {Date} endDate 일정의 종료 날짜입니다.
 * @param {Day} day 일정이 적용될 요일입니다.
 * @param {Date} startTime 일정의 시작 시간입니다.
 * @param {Date} endTime 일정의 종료 시간입니다.
 * @param {FacilityEvent} event 등록할 이벤트 정보를 담은 객체입니다.
 * @returns {Promise<boolean>} 일정 등록 성공 시 true를, 실패 시 false를 반환합니다.
 * 에러 발생 시, 오류 메시지와 코드를 포함한 객체가 반환될 수 있습니다.
 */
export async function registerFixedSchedule(token: string, facility: Facility, building: Building, startDate: Date, endDate: Date, day: Day, startTime: Date, endTime: Date, event: FacilityEvent): Promise<boolean> {
    let responseData: RegisterFixedScheduleResponse | undefined = undefined;

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const formatTime = (time: Date): string => {
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        const seconds = time.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
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
            time: {
                start: formatTime(startTime),
                end: formatTime(endTime)
            },
            event: {
                name: event.getName(),
                hostName: event.getHostName(),
                outline: event.getOutline(),
                purpose: event.getPurpose(),
                guestNumber: event.getGuestNumber()
            }
        };
        const response = await axios.post(
            getApiUrl("/api/admin/fixedSchedules/"),
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
    return "scheduleId" in responseData!;
}




/*****************************************************************
 * 서버에 저장된 고정 일정을 수정하는 API 메서드입니다.
 *****************************************************************/

/** 고정 일정 수정 응답 데이터 타입 */
type ModifyFixedScheduleResponse = {
    scheduleId: number;
} | {
    message: string;
    code: string;
};

/**
 * modifyFixedSchedule 메서드는 서버에 저장된 특정 고정 일정을 수정합니다.
 * 이 메서드는 인증 토큰과 함께 고정 일정 객체(FacilitySchedule), 시설(Facility), 건물(Building), 시작/종료 날짜, 요일, 이벤트 정보를 포함한 데이터를 서버에 전송합니다.
 * 성공적으로 일정이 수정되면, 서버로부터 업데이트된 일정 ID를 받습니다.
 * 
 * @param {string} token 현재 사용자의 인증 토큰입니다.
 * @param {FacilitySchedule} facilitySchedule 수정할 고정 일정 객체입니다.
 * @param {Facility} facility 수정할 시설 객체입니다.
 * @param {Building} building 수정할 건물 객체입니다.
 * @param {Date} startDate 수정할 일정의 시작 날짜입니다.
 * @param {Date} endDate 수정할 일정의 종료 날짜입니다.
 * @param {Day} day 수정할 일정이 적용될 요일입니다.
 * @param {FacilityEvent} event 수정할 이벤트 정보를 담은 객체입니다.
 * @returns {Promise<boolean>} 일정 수정 성공 시 true를, 실패 시 false를 반환합니다.
 * 에러 발생 시, 오류 메시지와 코드를 포함한 객체가 반환될 수 있습니다.
 */
export async function modifyFixedSchedule(token: string, facilitySchedule: FacilitySchedule, facility: Facility, building: Building, startDate: Date, endDate: Date, day: Day, event: FacilityEvent): Promise<boolean> {
    let responseData: ModifyFixedScheduleResponse | undefined = undefined;

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const formatTime = (time: Date): string => {
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        const seconds = time.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    try {
        const postData = {
            scheduleId: facilitySchedule.getScheduleId(),
            scheduleInfo: {
                facility: {
                    code: facility.getCode(),
                    buildingName: building.getName()
                },
                effectiveDate: {
                    start: formatDate(startDate),
                    end: formatDate(endDate)
                },
                day: day,
                time: {
                    start: formatTime(facilitySchedule.getStartTime()),
                    end: formatTime(facilitySchedule.getEndTime())
                },
                event: {
                    name: event.getName(),
                    hostName: event.getHostName(),
                    outline: event.getOutline(),
                    purpose: event.getPurpose(),
                    guestNumber: event.getGuestNumber()
                }
            }
        };
        const response = await axios.patch(
            getApiUrl("/api/admin/fixedSchedules/"),
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
    return "scheduleId" in responseData!;
}




/*****************************************************************
 * 서버에 저장된 고정 일정을 삭제하는 API 메서드입니다.
 *****************************************************************/

/** 고정 일정 삭제 응답 데이터 타입 */
type DeleteFixedScheduleResponse = "success" | {
    message: string;
    code: string;
};

/**
 * deleteFixedSchedule 메서드는 서버에 저장된 특정 고정 일정을 삭제합니다.
 * 이 메서드는 인증 토큰과 함께 고정 일정 객체(FacilitySchedule)에서 가져온 일정 ID를 사용하여,
 * 해당 일정을 삭제하는 요청을 서버에 전송합니다.
 * 
 * @param {string} token 현재 사용자의 인증 토큰입니다.
 * @param {FacilitySchedule} facilitySchedule 삭제할 고정 일정 객체입니다.
 * @returns {Promise<boolean>} 일정 삭제 성공 시 true를, 실패 시 false를 반환합니다.
 * 에러 발생 시, 오류 메시지와 코드를 포함한 객체가 반환될 수 있으며, 이 경우 false가 반환됩니다.
 */
export async function deleteFixedSchedule(token: string, facilitySchedule: FacilitySchedule): Promise<boolean> {
    let responseData: DeleteFixedScheduleResponse | undefined = undefined;
    try {
        const queryParams = facilitySchedule.getScheduleId();
        const response = await axios.delete(
            getApiUrl(`/api/admin/fixedSchedules/${queryParams}`),
            {
                headers: {
                    "Authorization": `Bearer ${token}`
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
    return responseData === "success";
}




/*****************************************************************
 * 사용자의 시설 북마크 정보를 가져오는 API입니다.
 *****************************************************************/

/** 나의 북마크 정보 응답 데이터 타입 */
type GetMyBookmarkResponse = {
    facilityName: string;
    facilityCode: string;
    buildingName: string;
    facilityState: "EMPTY" | "USING";
}[]

/**
 * getMyBookmark 메서드는 현재 사용자의 모든 북마크 목록을 조회합니다.
 * 이 메서드는 인증 토큰을 사용하여 서버에 사용자의 북마크 정보 요청을 전송합니다.
 * 
 * @param {string} token 현재 사용자의 인증 토큰입니다.
 * @returns {Promise<Bookmark[]>} 서버로부터 받은 북마크 정보를 Bookmark 객체 배열로 반환합니다.
 * 각 객체에는 시설명, 시설 코드, 건물명이 포함됩니다.
 * 에러 발생 시 빈 배열을 반환합니다.
 */
export async function getMyBookmark(token: string): Promise<Bookmark[]> {
    let responseData: GetMyBookmarkResponse = [];
    try {
        const response = await axios.get(
            getApiUrl("/api/user/bookmark"),
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        responseData = response.data;
    } catch (error) {
        console.error(error);
    }
    return responseData.map((item) => new Bookmark(item.facilityName, item.facilityCode, item.buildingName, item.facilityState));
}




/*****************************************************************
 * 사용자가 시설을 북마크에 등록하는 API입니다.
 *****************************************************************/

/** 북마크 등록 응답 데이터 타입 */
type RegisterBookmarkResponse = string;

/**
 * registerBookmark 메서드는 서버에 새로운 북마크를 등록합니다.
 * 이 메서드는 인증 토큰, 건물 코드, 건물명을 사용하여 서버에 북마크 등록 요청을 전송합니다.
 * 
 * @param {string} token 현재 사용자의 인증 토큰입니다.
 * @param {string} code 건물의 고유 코드입니다.
 * @param {string} buildingName 건물명입니다.
 * @returns {Promise<boolean>} 북마크 등록 성공 여부를 반환합니다.
 * 성공 시 true, 실패 시 false를 반환합니다.
 */
export async function registerBookmark(token: string, code: string, buildingName: string): Promise<boolean> {
    let responseData: RegisterBookmarkResponse = "";
    try {
        const postData = { code, buildingName };
        const response = await axios.post(
            getApiUrl("/api/user/bookmark"),
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
        console.error(error);
    }
    return responseData.includes("등록 성공");
}




/*****************************************************************
 * 사용자가 시설을 북마크 해제하는 API입니다.
 *****************************************************************/

/** 북마크 해제 응답 데이터 타입 */
type RemoveBookmarkResponse = string;

/**
 * removeBookmark 메서드는 서버에 저장된 북마크를 해제합니다.
 * 이 메서드는 인증 토큰, 건물 코드, 건물명을 사용하여 서버에 북마크 해제 요청을 전송합니다.
 * 
 * @param {string} token 현재 사용자의 인증 토큰입니다.
 * @param {string} code 건물의 고유 코드입니다.
 * @param {string} buildingName 건물명입니다.
 * @returns {Promise<boolean>} 북마크 해제 성공 여부를 반환합니다.
 * 성공 시 true, 실패 시 false를 반환합니다.
 */
export async function removeBookmark(token: string, code: string, buildingName: string): Promise<boolean> {
    let responseData: RemoveBookmarkResponse = "";
    try {
        const response = await axios.delete(
            getApiUrl(`/api/user/bookmark/${buildingName}/${code}`),
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                withCredentials: true
            }
        );
        responseData = response.data;
    } catch (error) {
        console.error(error);
    }
    return responseData.includes("해제 성공");
}


/*****************************************************************
 * 서버로부터 모든 공지사항 정보를 가져오는 API 메서드입니다.
 *****************************************************************/

/** 공지사항 정보 응답 데이터 타입 */
type GetAnnouncementsResponse = {
    authorId: string;
    boardId: number;
    body: string;
    title: string;
}[];

/**
 * getAnnouncements 메서드는 서버에 저장된 모든 공지사항 목록을 조회합니다.
 * 이 메서드는 인증 토큰을 사용하여 서버에 공지사항 정보 요청을 전송합니다.
 * 
 * @param {string} token 현재 사용자의 인증 토큰입니다.
 * @returns {Promise<Announcement[]>} 서버로부터 받은 공지사항 정보를 Announcement 객체 배열로 반환합니다.
 * 각 객체에는 공지사항의 게시판 ID, 제목, 작성자 ID가 포함됩니다.
 * 에러 발생 시 빈 배열을 반환합니다.
 */
export async function getAnnouncements(token: string): Promise<Announcement[]> {
    let responseData: GetAnnouncementsResponse = [];
    try {
        const response = await axios.get(
            getApiUrl("/api/board/"),
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
    return responseData.map((announcement) => new Announcement(announcement.boardId, announcement.title, announcement.body, announcement.authorId));
}




/*****************************************************************
 * 새로운 공지사항을 서버에 등록하는 API 메서드입니다.
 *****************************************************************/

/** 공지사항 등록 응답 데이터 타입 */
type RegisterAnnouncementResponse = {
    boardId: number;
};

/**
 * registerAnnouncement 메서드는 새로운 공지사항을 서버에 등록합니다.
 * 이 메서드는 인증 토큰, 공지사항 제목, 그리고 본문을 사용하여 서버에 새 공지사항을 생성하는 요청을 전송합니다.
 * 
 * @param {string} token 현재 사용자의 인증 토큰입니다.
 * @param {string} title 공지사항의 제목입니다.
 * @param {string} body 공지사항의 본문입니다.
 * @returns {Promise<boolean>} 공지사항 등록 성공 여부를 반환합니다.
 * 성공적으로 등록되었을 경우 true, 그렇지 않으면 false를 반환합니다.
 * 에러 발생 시, 오류 메시지가 콘솔에 출력됩니다.
 */
export async function registerAnnouncement(token: string, title: string, body: string): Promise<boolean> {
    let responseData: RegisterAnnouncementResponse | undefined = undefined;
    try {
        const postData = { title, body };
        const response = await axios.post(
            getApiUrl("/api/admin/board/"),
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
        console.error(error);
    }
    return responseData !== undefined && ("boardId" in responseData!);
}




/*****************************************************************
 * 서버에 저장된 공지사항을 삭제하는 API 메서드입니다.
 *****************************************************************/

/** 공지사항 삭제 응답 데이터 타입 */
type RemoveAnnouncementResponse = number;

/**
 * removeAnnouncement 메서드는 서버에 저장된 특정 공지사항을 삭제합니다.
 * 이 메서드는 인증 토큰과 함께 공지사항의 고유 boardId를 사용하여,
 * 해당 공지사항을 삭제하는 요청을 서버에 전송합니다.
 * 
 * @param {string} token 현재 사용자의 인증 토큰입니다.
 * @param {number} boardId 삭제할 공지사항의 고유 ID입니다.
 * @returns {Promise<boolean>} 공지사항 삭제 성공 여부를 반환합니다.
 * 성공적으로 삭제되었을 경우 true, 그렇지 않으면 false를 반환합니다.
 * 에러 발생 시, 오류 메시지가 콘솔에 출력됩니다.
 */
export async function removeAnnouncement(token: string, boardId: number): Promise<boolean> {
    let responseData: RemoveAnnouncementResponse | undefined = undefined;
    try {
        const response = await axios.delete(
            getApiUrl(`/api/admin/board/${boardId}`),
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                withCredentials: true
            }
        );
        responseData = response.data;
    } catch (error) {
        console.error(error);
    }
    return responseData !== undefined;
}




/*****************************************************************
 * 서버에 저장된 공지사항을 수정하는 API 메서드입니다.
 *****************************************************************/

/** 공지사항 수정 응답 데이터 타입 */
type ModifyAnnouncementResponse = {
    boardId: number;
};

/**
 * modifyAnnouncement 메서드는 서버에 저장된 특정 공지사항의 내용을 수정합니다.
 * 이 메서드는 인증 토큰과 함께 공지사항의 고유 boardId, 수정할 제목(title), 
 * 및 내용(body)을 사용하여 해당 공지사항을 수정하는 요청을 서버에 전송합니다.
 * 
 * @param {string} token 현재 사용자의 인증 토큰입니다.
 * @param {number} boardId 수정할 공지사항의 고유 ID입니다.
 * @param {string} title 수정할 공지사항의 제목입니다.
 * @param {string} body 수정할 공지사항의 내용입니다.
 * @returns {Promise<boolean>} 공지사항 수정 성공 여부를 반환합니다.
 * 성공적으로 수정되었을 경우 true, 그렇지 않으면 false를 반환합니다.
 * 에러 발생 시, 오류 메시지가 콘솔에 출력됩니다.
 */
export async function modifyAnnouncement(token: string, boardId: number, title: string, body: string): Promise<boolean> {
    let responseData: ModifyAnnouncementResponse | undefined = undefined;
    try {
        const postData = { title, body };
        const response = await axios.patch(
            getApiUrl(`/api/admin/board/${boardId}`),
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
        console.error(error);
    }
    return responseData !== undefined && ("boardId" in responseData!);
}




/*****************************************************************
 * 서버로부터 특정 공지사항의 상세 내용을 조회하는 API 메서드입니다.
 *****************************************************************/

/** 공지사항 상세 내용 응답 데이터 타입 */
type GetAnnouncementBodyResponse = {
    title: string;
    body: string;
    authorId: string;
};

/**
 * getAnnouncementBody 메서드는 서버로부터 특정 공지사항의 상세 내용을 조회합니다.
 * 이 메서드는 인증 토큰과 공지사항의 고유 boardId를 사용하여,
 * 해당 공지사항의 상세 제목, 내용, 작성자 ID를 조회하는 요청을 서버에 전송합니다.
 * 
 * @param {string} token 현재 사용자의 인증 토큰입니다.
 * @param {number} boardId 조회할 공지사항의 고유 ID입니다.
 * @returns {Promise<GetAnnouncementBodyResponse | undefined>} 공지사항의 상세 내용을 반환합니다.
 * 공지사항의 제목, 내용, 작성자 ID가 포함된 객체를 반환합니다.
 * 에러 발생 시, undefined를 반환하며 오류 메시지가 콘솔에 출력됩니다.
 */
export async function getAnnouncementBody(token: string, boardId: number): Promise<GetAnnouncementBodyResponse | undefined> {
    let responseData: GetAnnouncementBodyResponse | undefined = undefined;
    try {
        const response = await axios.get(
            getApiUrl(`/api/board/${boardId}`),
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                withCredentials: true
            }
        );
        responseData = response.data;
    } catch (error) {
        console.error(error);
    }
    return responseData;
}



/*
  "title": "string",
  "date": "string",
  "startTime": "string",
  "endTime": "string",
  "facilityCode": "string",
  "buildingName": "string",
  "outline": "string",
  "purpose": "string",
  "guestIds": [
    "string"
  ]
*/

/** TODO: 구현 필요 */
export async function registerReservation(
    token: string,
    hostName: string,
    date: Date,
    startTime: Date,
    endTime: Date,
    facility: Facility,
    building: Building,
    purpose: string,
    guestIds: string[]
): Promise<string> {
    let responseData: any = 0;

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const formatTime = (time: Date): string => {
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        const seconds = time.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const postData = {
        title: hostName,
        date: formatDate(date),
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
        facilityCode: facility.getCode(),
        buildingName: building.getName(),
        outline: purpose,
        purpose: purpose,
        guestIds: guestIds
    };
    try {
        console.log(postData)
        const response = await axios.post(
            getApiUrl("/api/reservation/registration"),
            postData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
        );
        responseData = response.status
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            responseData = error.response.data;
        }
    }
    return typeof responseData === 'object' ? responseData.message: "에약 성공";
}


export async function modifyReservation(token: string, reservationId: number, outline: string): Promise<boolean> {
    let responseData: number = 0;
    const postData = {
        "reservationId": reservationId,
        "outline": outline,
        "guestIds": []
    };
    try {
        const response = await axios.post(
            getApiUrl("/api/reservation/modification"),
            postData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
        );
        responseData = response.status
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            responseData = error.response.data;
        }
    }
    return responseData === 200;
}




export async function deleteReservation(token: string, reservationId: number): Promise<boolean> {
    let responseData: number = 0;
    try {
        const response = await axios.delete(
            getApiUrl(`/api/reservation/deletion/${reservationId}`),
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                withCredentials: true
            }
        );
        responseData = response.status;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            responseData = error.response.data;
        }
    }
    return responseData === 200;
}




export async function getMyReservations(token: string): Promise<Reservation[]> {
    let responseData: GetReservationsResponse = [];
    try {
        const response = await axios.get(
            getApiUrl("/api/reservation"),
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
    return responseData.map((reservations) => new Reservation(
        reservations.reservationId,
        reservations.title,
        reservations.status,
        reservations.date,
        reservations.startTime,
        reservations.endTime,
        reservations.facilityCode,
        reservations.buildingName,
        reservations.facilityName,
        reservations.facilityState,
        reservations.outline,
        reservations.purpose,
        new User(reservations.host.id, reservations.host.sid, reservations.host.name, reservations.host.major || "", reservations.host.email, reservations.host.role),
        reservations.guests));
}




export async function finishFacilityUsing(token: string, buildingName: string, facilityCode: string): Promise<boolean> {
    let responseData: number = 0;
    try {
        const response = await axios.get(
            getApiUrl(`/api/facility/finish/${buildingName}/${facilityCode}`),
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                withCredentials: true
            }
        );
        responseData = response.status
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            responseData = error.response.data;
        }
    }
    return responseData === 200;
}