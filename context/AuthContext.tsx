import createAPIClient from "@/services/api";
import * as jwt from 'jose';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

type AuthContextType = {
    uid: string | null;
    userRole: string | null;
    accessToken: string | null;
    accessTokenTTL: number | null;
    refreshToken: string | null;
    isAuthLoading: boolean;
    loginTokens: (accessToken: string, refreshToken: string, uid: string, userRole?: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshAccessToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REFRESH_TOKEN_KEY = "refresh_token";
const ACCESS_TOKEN_KEY = "access_token";
const UID_KEY = "uid";

// Import storage utilities from api.tsx
import { deleteStoredItem, getStoredItem, setStoredItem } from "@/services/api";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const api = useMemo(() => createAPIClient(), []);
    const [uid, setUid] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [accessTokenTTL, setAccessTokenTTL] = useState<number | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);


    const refreshAccessToken = useCallback(() => {
        if (!refreshToken) return Promise.resolve();
        return api.post("/user/refresh-token", { refreshToken }, { withCredentials: true })
            .then((response) => {
                return Promise.all([
                    setStoredItem(ACCESS_TOKEN_KEY, response.data.accessToken),
                    setStoredItem(REFRESH_TOKEN_KEY, response.data.refreshToken)
                ]).then(() => {
                    setAccessToken(response.data.accessToken);
                    setRefreshToken(response.data.refreshToken);

                    if(response.data.accessToken){
                        const payload = jwt.decodeJwt(response.data.accessToken);
                        if(payload.exp && payload.iat) {
                            setAccessTokenTTL(1000 * (payload.exp - payload.iat));
                        }
                    }
                });
            })
            .catch(() => {
                // Silent error - token refresh failed
            });
    }, [api, refreshToken]);

    const fetchUserRole = useCallback((uid: string) => {
        return api.get(`/user/role/${uid}`)
            .then((response) => {
                setUserRole(response.data);
            })
            .catch(() => {
                // Silent error - user role fetch failed
            });
    }, [api]);

    const deleteRefreshToken = useCallback(() => {
        setUid(null);
        setAccessToken(null);
        setRefreshToken(null);
        return Promise.all([
            deleteStoredItem(REFRESH_TOKEN_KEY),
            deleteStoredItem(ACCESS_TOKEN_KEY),
            deleteStoredItem(UID_KEY)
        ]);
    }, []);

    const loginTokens = useCallback((newAccessToken: string, newRefreshToken: string, uid: string) => {
        setUid(uid);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        return Promise.all([
            setStoredItem(ACCESS_TOKEN_KEY, newAccessToken || ''),
            setStoredItem(REFRESH_TOKEN_KEY, newRefreshToken || ''),
            setStoredItem(UID_KEY, uid || '')
        ]);
    }, []);
    
    const logout = useCallback(() => {
        return deleteRefreshToken();
    }, [deleteRefreshToken]);

    //Load tokens from storage (SecureStore for mobile, cookies for web) when the app starts
    useEffect(() => {
        (async () => {
            const refreshTokenStore = await getStoredItem(REFRESH_TOKEN_KEY);
            if (refreshTokenStore) {
                setRefreshToken(refreshTokenStore);
            }

            const accessTokenStore = await getStoredItem(ACCESS_TOKEN_KEY);
            if (accessTokenStore) {
                setAccessToken(accessTokenStore);
                
                // Decode token to get TTL
                const payload = jwt.decodeJwt(accessTokenStore);
                if(payload.exp && payload.iat) {
                    setAccessTokenTTL(1000 * (payload.exp - payload.iat));
                }
            }

            const uidStore = await getStoredItem(UID_KEY);
            if (uidStore) {
                setUid(uidStore);
                fetchUserRole(uidStore);
            }
            
            // Mark auth as loaded
            setIsAuthLoading(false);
        })();
    }, [fetchUserRole]);

    return(
        <AuthContext.Provider value={{ uid, accessToken, accessTokenTTL, refreshToken, loginTokens, logout, refreshAccessToken, userRole, isAuthLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};