import { CookieStorageProvider } from "../modules/storage/AppStorageProvider";

// useAuth.ts
function useAuth() : Boolean {
    
    const token = CookieStorageProvider.get("userAuthToken");
    let isUserLoggedIn : Boolean = false; 
    
    if(token !== null && token !== undefined && token !== "") {
        isUserLoggedIn = true;
    }else{
        isUserLoggedIn = false;
    }
    
    return isUserLoggedIn;
}
  
export default useAuth;