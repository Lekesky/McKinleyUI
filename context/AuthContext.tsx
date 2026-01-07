import { router } from "expo-router";
import * as jwt from 'jose';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native"; // For web session tracking
import { Toast } from "toastify-react-native";

// Import storage utilities from api.tsx
import createAPIClient, { deleteStoredItem, getStoredItem, setStoredItem } from "@/services/api";

type AuthContextType = {
    uid: string | null;
    userRole: string | null;
    accessToken: string | null;
    accessTokenTTL: number | null;
    refreshToken: string | null;
    isAuthenticated: boolean; // New flag for web auth state
    isAuthLoading: boolean;
    loginTokens: (accessToken: string, refreshToken: string, uid: string, userRole?: string) => Promise<void>;
    logout: () => Promise<void>;
    deleteAccount: () => Promise<void>;
    refreshAccessToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REFRESH_TOKEN_KEY = "refresh_token";
const ACCESS_TOKEN_KEY = "access_token";
const UID_KEY = "uid";
const IS_AUTHENTICATED_KEY = "is_authenticated";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const api = useMemo(() => createAPIClient(), []);
    const [uid, setUid] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [accessTokenTTL, setAccessTokenTTL] = useState<number | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);


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
        setIsAuthenticated(false);
        return Promise.all([
            deleteStoredItem(REFRESH_TOKEN_KEY),
            deleteStoredItem(ACCESS_TOKEN_KEY),
            deleteStoredItem(UID_KEY),
            deleteStoredItem(IS_AUTHENTICATED_KEY)
        ]).then(() => {});
    }, []);

    const refreshAccessToken = useCallback(() => {
        // For web, cookies are sent automatically. For mobile, we need the refresh token
        if (Platform.OS !== 'web' && !refreshToken) return Promise.resolve();
        
        // Use a direct axios call to avoid interceptor loops
        // For web, send empty body (cookies are automatically sent)
        // For mobile, send the refresh token in the body
        const payload = Platform.OS === 'web' ? {} : { refreshToken };
        const config = { 
            headers: { 'X-Client-Type': Platform.OS === 'web' ? 'WEB' : 'MOBILE' },
        };
        
        return api.post("/user/refresh-token", payload, config)
            .then((response) => {
                // For mobile, save the new tokens and update state
                if (Platform.OS !== 'web') {
                    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
                    return Promise.all([
                        setStoredItem(ACCESS_TOKEN_KEY, newAccessToken),
                        setStoredItem(REFRESH_TOKEN_KEY, newRefreshToken)
                    ]).then(() => {
                        setAccessToken(newAccessToken);
                        setRefreshToken(newRefreshToken);

                        if(newAccessToken){
                            const payload = jwt.decodeJwt(newAccessToken);
                            if(payload.exp && payload.iat) {
                                setAccessTokenTTL(1000 * (payload.exp - payload.iat));
                            }
                        }
                    });
                }
                // For web, tokens are already in cookies, no need to store
                return Promise.resolve();
            })
            .catch((error) => {
                console.error('Token refresh failed:', error);
            });
    }, [api, refreshToken, deleteRefreshToken]);

    const loginTokens = useCallback(async (newAccessToken: string, newRefreshToken: string, newUid: string) => {
        console.log('loginTokens called with:', { 
            accessToken: newAccessToken ? 'present' : 'missing', 
            refreshToken: newRefreshToken ? 'present' : 'missing', 
            uid: newUid 
        });
        
        setUid(newUid);
        setIsAuthenticated(true);
        
        // For web, tokens are in HTTP-only cookies, so we only store uid and auth flag
        // For mobile, we store the actual tokens
        if (Platform.OS === 'web') {
            await Promise.all([
                setStoredItem(UID_KEY, newUid || ''),
                setStoredItem(IS_AUTHENTICATED_KEY, 'true')
            ]);
        } else {
            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);
            
            // Decode token to get TTL on mobile
            if (newAccessToken) {
                try {
                    const payload = jwt.decodeJwt(newAccessToken);
                    if (payload.exp && payload.iat) {
                        setAccessTokenTTL(1000 * (payload.exp - payload.iat));
                    }
                } catch (e) {
                    console.error('Failed to decode access token:', e);
                }
            }
            
            await Promise.all([
                setStoredItem(ACCESS_TOKEN_KEY, newAccessToken || ''),
                setStoredItem(REFRESH_TOKEN_KEY, newRefreshToken || ''),
                setStoredItem(UID_KEY, newUid || '')
            ]);
        }
        
        // Fetch user role for both web and mobile after login
        await fetchUserRole(newUid);
        
        console.log('loginTokens completed successfully');
    }, [fetchUserRole]);
    
    const logout = useCallback(async () => {
        // For web, also call the logout endpoint to clear HTTP-only cookies
        if (Platform.OS === 'web') {
             api.post('/user/logout')
                .then(async (res) => {
                    if(res.status === 200){
                        await deleteRefreshToken();
                        router.replace('/Intro');
                    }
                }).catch((error) => {
                    const errorMessage = error.response?.data || error.message || 'Failed to logout';
                    Toast.show({
                        type: 'error',
                        text1: 'Logout Error',
                        text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to logout',
                        position: 'top',
                        backgroundColor: '#871919ff',
                        textColor: '#FFFFFF',
                    });
                });
        }else{
            api.post('/user/logout', { refreshToken: refreshToken })
                .then(async (res) => {
                    if(res.status === 200){
                        await deleteRefreshToken();
                        router.replace('/Intro');
                    }
                }).catch((error) => {
                    const errorMessage = error.response?.data || error.message || 'Failed to logout';
                    Toast.show({
                        type: 'error',
                        text1: 'Logout Error',
                        text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to logout',
                        position: 'top',
                        backgroundColor: '#871919ff',
                        textColor: '#FFFFFF',
                    });
                });
        }
    }, [api, deleteRefreshToken]);

    const deleteAccount = useCallback(async () => {
        // For web, also call the delete account endpoint to clear HTTP-only cookies
        if (Platform.OS === 'web') {
            api.delete(`/user/${uid}`)
                .then(async (res) => {
                    if (res.status === 200) {
                        Toast.show({
                            type: 'success',
                            text1: 'Success',
                            text2: 'Account deleted successfully',
                            position: 'top',
                            backgroundColor: '#4CAF50',
                            textColor: '#FFFFFF',
                        });
                        router.replace('/Intro');
                    }
                }).catch((error) => {
                    const errorMessage = error.response?.data || error.message || 'Failed to delete account';
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to delete account',
                        position: 'top',
                        backgroundColor: '#871919ff',
                        textColor: '#FFFFFF',
                    });
                });
        }else{
            api.delete(`/user/${uid}`)
                .then(async (res) => {
                    if (res.status === 200) {
                        Toast.show({
                            type: 'success',
                            text1: 'Success',
                            text2: 'Account deleted successfully',
                            position: 'top',
                            backgroundColor: '#4CAF50',
                            textColor: '#FFFFFF',
                        });
                        router.replace('/Intro');
                    }
                }).catch((error) => {
                    const errorMessage = error.response?.data || error.message || 'Failed to delete account';
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to delete account',
                        position: 'top',
                        backgroundColor: '#871919ff',
                        textColor: '#FFFFFF',
                    });
                });
        }

        }, [api]);

    //Load tokens from storage (SecureStore for mobile, cookies for web) when the app starts
    useEffect(() => {
        (async () => {
            if (Platform.OS === 'web') {
                // For web, check the auth flag and uid (tokens are in HTTP-only cookies)
                const isAuthenticatedStore = await getStoredItem(IS_AUTHENTICATED_KEY);
                const uidStore = await getStoredItem(UID_KEY);
                
                if (isAuthenticatedStore === 'true' && uidStore) {
                    setIsAuthenticated(true);
                    setUid(uidStore);
                    fetchUserRole(uidStore);
                }
            } else {
                // For mobile, load tokens from secure storage
                const refreshTokenStore = await getStoredItem(REFRESH_TOKEN_KEY);
                if (refreshTokenStore) {
                    setRefreshToken(refreshTokenStore);
                    setIsAuthenticated(true);
                }

                const accessTokenStore = await getStoredItem(ACCESS_TOKEN_KEY);
                if (accessTokenStore) {
                    setAccessToken(accessTokenStore);
                    
                    // Decode token to get TTL
                    try {
                        const payload = jwt.decodeJwt(accessTokenStore);
                        if (payload.exp && payload.iat) {
                            setAccessTokenTTL(1000 * (payload.exp - payload.iat));
                        }
                    } catch (e) {
                        console.error('Failed to decode stored access token:', e);
                    }
                }

                const uidStore = await getStoredItem(UID_KEY);
                if (uidStore) {
                    setUid(uidStore);
                    fetchUserRole(uidStore);
                }
            }
            
            // Mark auth as loaded
            setIsAuthLoading(false);
        })();
    }, [fetchUserRole]);

    return(
        <AuthContext.Provider value={{ uid, accessToken, accessTokenTTL, refreshToken, isAuthenticated, loginTokens, logout,  deleteAccount, refreshAccessToken, userRole, isAuthLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};