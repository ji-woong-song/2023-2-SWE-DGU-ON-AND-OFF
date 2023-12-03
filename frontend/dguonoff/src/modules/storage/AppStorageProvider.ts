import Cookies from 'js-cookie';



/**
 * CookieStorageProvider 클래스는 js-cookie 라이브러리를 사용하여 브라우저의 쿠키를 관리합니다.
 * 이 클래스는 쿠키를 설정, 검색, 제거 및 모든 쿠키를 클리어하는 정적 메서드를 제공합니다.
 */
export class CookieStorageProvider {

    /**
     * set 메서드는 주어진 키와 값을 쿠키에 저장합니다.
     * @param {string} key - 쿠키에 저장할 키입니다.
     * @param {any} value - 저장할 값입니다.
     * @param {number | undefined} [expires=7] - 쿠키의 만료 기간입니다(일 단위). 기본값은 7일입니다.
     */
    public static set(key: string, value: any, expires: number = 7): void {
        try {
            Cookies.set(key, value, { expires: expires });
        } catch (error) {
            console.error('Error setting cookie:', error);
        }
    }

    /**
     * get 메서드는 주어진 키에 대응하는 값을 쿠키에서 검색합니다.
     * @param {string} key - 쿠키에서 검색할 키입니다.
     * @returns {string | undefined} 검색된 값 또는 undefined를 반환합니다.
     */
    public static get(key: string): string | undefined {
        try {
            return Cookies.get(key);
        } catch (error) {
            console.error('Error getting cookie:', error);
            return undefined;
        }
    }

    /**
     * remove 메서드는 주어진 키에 대응하는 항목을 쿠키에서 제거합니다.
     * @param {string} key - 쿠키에서 제거할 항목의 키입니다.
     */
    public static remove(key: string): void {
        try {
            Cookies.remove(key);
        } catch (error) {
            console.error('Error removing cookie:', error);
        }
    }

    /**
     * clearAll 메서드는 모든 쿠키를 제거합니다.
     */
    public static clearAll(): void {
        try {
            const allCookies = Cookies.get();
            for (const key in allCookies) {
                Cookies.remove(key);
            }
        } catch (error) {
            console.error('Error clearing all cookies:', error);
        }
    }
}




/**
 * LocalStorageProvider 클래스는 localStorage를 사용하여 데이터를 저장하고 불러옵니다.
 * 이 클래스는 데이터를 저장, 검색, 제거, 그리고 로컬 스토리지를 클리어하는 정적 메서드를 제공합니다.
 */
export class LocalStorageProvider {
    /**
     * 생성자 메서드입니다. LocalStorageProvider 클래스의 인스턴스를 생성하지 않도록 private로 설정되어 있습니다.
     */
    private constructor() { }


    /**
     * set 메서드는 주어진 키와 값을 로컬 스토리지에 저장합니다.
     * @param {string} key - 데이터를 저장할 키입니다.
     * @param {any} value - 저장할 값입니다. 값은 JSON 문자열로 변환됩니다.
     */
    public static set(key: string, value: any): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Error setting localStorage:', error);
        }
    }


    /**
     * get 메서드는 주어진 키에 대응하는 값을 로컬 스토리지에서 검색합니다.
     * @param {string} key - 데이터를 검색할 키입니다.
     * @returns {T | null} 검색된 값 또는 null을 반환합니다.
     */
    public static get<T>(key: string): T | null {
        try {
            const serializedValue = localStorage.getItem(key);
            if (serializedValue === null) {
                return null;
            }
            return JSON.parse(serializedValue) as T;
        } catch (error) {
            console.error('Error getting localStorage:', error);
            return null;
        }
    }


    /**
     * remove 메서드는 주어진 키에 대응하는 항목을 로컬 스토리지에서 제거합니다.
     * @param {string} key - 제거할 항목의 키입니다.
     */
    public static remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing localStorage:', error);
        }
    }


    /**
     * clear 메서드는 로컬 스토리지의 모든 항목을 제거합니다.
     */
    public static clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
}




/**
 * SessionStorageProvider 클래스는 sessionStorage를 사용하여 데이터를 저장하고 불러옵니다.
 * 이 클래스는 데이터를 저장, 검색, 제거, 그리고 세션 스토리지를 클리어하는 정적 메서드를 제공합니다.
 */
export class SessionStorageProvider {
    /**
     * 생성자 메서드입니다. SessionStorageProvider 클래스의 인스턴스를 생성하지 않도록 private로 설정되어 있습니다.
     */
    private constructor() { }


    /**
     * set 메서드는 주어진 키와 값을 세션 스토리지에 저장합니다.
     * @param {string} key - 데이터를 저장할 키입니다.
     * @param {any} value - 저장할 값입니다. 값은 JSON 문자열로 변환됩니다.
     */
    public static set(key: string, value: any): void {
        try {
            const serializedValue = JSON.stringify(value);
            sessionStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Error setting sessionStorage:', error);
        }
    }


    /**
     * get 메서드는 주어진 키에 대응하는 값을 세션 스토리지에서 검색합니다.
     * @param {string} key - 데이터를 검색할 키입니다.
     * @returns {T | null} 검색된 값 또는 null을 반환합니다.
     */
    public static get<T>(key: string): T | null {
        try {
            const serializedValue = sessionStorage.getItem(key);
            if (serializedValue === null) {
                return null;
            }
            return JSON.parse(serializedValue) as T;
        } catch (error) {
            console.error('Error getting sessionStorage:', error);
            return null;
        }
    }


    /**
     * remove 메서드는 주어진 키에 대응하는 항목을 세션 스토리지에서 제거합니다.
     * @param {string} key - 제거할 항목의 키입니다.
     */
    public static remove(key: string): void {
        try {
            sessionStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing sessionStorage:', error);
        }
    }


    /**
     * clear 메서드는 세션 스토리지의 모든 항목을 제거합니다.
     */
    public static clear(): void {
        try {
            sessionStorage.clear();
        } catch (error) {
            console.error('Error clearing sessionStorage:', error);
        }
    }
}
