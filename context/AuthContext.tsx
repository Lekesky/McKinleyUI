import createAPIClient from "@/services/api";
import * as SecureStore from "expo-secure-store";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

type AuthContextType = {
    uid: string | null;
    userRole: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    loginTokens: (accessToken: string, refreshToken: string, uid: string, userRole?: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshAccessToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REFRESH_TOKEN_KEY = "refresh_token";
const ACCESS_TOKEN_KEY = "access_token";
const UID_KEY = "uid";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const api = createAPIClient();
    const [uid, setUid] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    

    const refreshAccessToken = useCallback(async () => {
        if (!refreshToken) return;
        api.post("/user/refresh-token", { refreshToken })
            .then(async (response) => {
                await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.data.accessToken);
                await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.data.refreshToken);
                setAccessToken(response.data.accessToken);
                setRefreshToken(response.data.refreshToken);
            })
            .catch((error) => {
                console.error("Error refreshing token HERE: ", error);
            });
    }, [api, refreshToken]);

    const fetchUserRole = useCallback(async (uid: string) => {
        api.get(`/user/role/${uid}`)
            .then((response) => {
                setUserRole(response.data);
            })
            .catch((error) => {
                console.error("Error fetching user role:", error);
            });
    }, [api]);

    const deleteRefreshToken = async () => {
        setUid(null);
        setAccessToken(null);
        setRefreshToken(null);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(UID_KEY);
        
    }

    const loginTokens = async (newAccessToken: string, newRefreshToken: string, uid: string) => {
        setUid(uid);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, newAccessToken || '');
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken || '');
        await SecureStore.setItemAsync(UID_KEY, uid || '');
    };
    
    const logout = async () => {
        await deleteRefreshToken();
    };

    //Load tokens from SecureStore when the app starts
    useEffect(() => {
        (async () => {
            const refreshTokenStore = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
            if (refreshTokenStore) {
                setRefreshToken(refreshTokenStore);
            }else{
                await refreshAccessToken();
            }

            const accessTokenStore = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
            if (accessTokenStore) {
                setAccessToken(accessTokenStore);
            }

            const uidStore = await SecureStore.getItemAsync(UID_KEY);
            if (uidStore) {
                setUid(uidStore);
            }
            if(uid) fetchUserRole(uid);

        })();
    }, [refreshAccessToken, fetchUserRole, uid]);

    return(
        <AuthContext.Provider value={{ uid, accessToken, refreshToken, loginTokens, logout, refreshAccessToken, userRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};