import createAPIClient, { setAccessTokenProvider } from "@/services/api";
import { getAuth0CredentialsArgs } from "@/services/auth0";
import { consumeAuthRedirectAction } from "@/services/authRedirect";
import { decodeJwt } from "jose";
import { createContext, ReactNode, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useAuth0 } from "react-native-auth0";

const isMissingRefreshTokenError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const authError = error as {
    error?: unknown;
    message?: unknown;
  };

  return (
    authError.error === 'missing_refresh_token' ||
    (typeof authError.message === 'string' &&
      authError.message.includes('Missing Refresh Token'))
  );
};

type AuthContextType = {
    uid: string | null;
    userRole: string | null;
    checkProfileComplete: (uid: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Increased buffer to 60 seconds to prevent stale tokens
// This ensures we refresh tokens well before they expire
const ACCESS_TOKEN_EXPIRY_BUFFER_SECONDS = 60;

const isTokenExpired = (
    token: string,
    bufferSeconds: number = ACCESS_TOKEN_EXPIRY_BUFFER_SECONDS
): boolean => {
    try {
        const { exp } = decodeJwt(token);
        if (!exp) {
            return false;
        }

        return exp * 1000 <= Date.now() + (bufferSeconds * 1000);
    } catch {
        return false;
    }
};

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider = ({
    children,
}: AuthProviderProps) => {
    const { getCredentials, isLoading, user } = useAuth0();
    const api = useMemo(() => createAPIClient(), []);
    const [uid, setUid] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

    const getValidAccessToken = useCallback(async (forceRefresh: boolean = false) => {
        if (!user) {
            return null;
        }

        try {
            // Get current credentials from Auth0
            let token = await getCredentials(...getAuth0CredentialsArgs(forceRefresh));

            // Check if token is expired or close to expiry
            const isExpired = isTokenExpired(token.accessToken);
            if (isExpired) {
                console.warn("Token is expired or close to expiry, refreshing...");
                // Force refresh if token is stale
                token = await getCredentials(...getAuth0CredentialsArgs(true));
            }

            // Verify the new token is still valid after refresh
            const validToken = isTokenExpired(token.accessToken) ? null : token.accessToken;
            
            if (validToken) {
                console.log("Valid access token obtained");
            } else {
                console.warn("Access token is expired even after refresh attempt");
            }
            
            return validToken;
        } catch (error) {
            console.error("Error getting valid access token:", error);
            if (isMissingRefreshTokenError(error)) {
                console.warn("Missing refresh token - user may need to re-authenticate");
                return null;
            }

            return null;
        }
    }, [getCredentials, user]);

    const fetchAppProfile = useCallback(async (profileUid: string) => {
        const response = await api.get(`/user/${profileUid}`);
        const { firstName, lastName, email, phoneNumber, userRole: nextUserRole } = response.data;
        return {
            isProfileComplete: !!(firstName && lastName && email && phoneNumber),
            userRole: nextUserRole ?? null,
        };
    }, [api]);

    const checkProfileComplete = useCallback((profileUid: string): Promise<boolean> => {
        return fetchAppProfile(profileUid)
            .then((profile) => {
                return profile.isProfileComplete;
            })
            .catch(() => {
                return false;
            });
    }, [fetchAppProfile]);

    useLayoutEffect(() => {
        setAccessTokenProvider(getValidAccessToken);

        return () => {
            setAccessTokenProvider(null);
        };
    }, [getValidAccessToken]);

    useEffect(() => {
        let isCancelled = false;

        const syncAppUser = async () => {
            if (isLoading) {
                return;
            }

            if (!user || !user?.sub) {
                if (isCancelled) {
                    return;
                }

                setUid(null);
                setUserRole(null);
                return;
            }

            try {
                let nextUid: string | null = null;
                const syncEndpoint = consumeAuthRedirectAction() === 'signup'
                    ? '/user'
                    : '/user/login';
                const response = await api.post(syncEndpoint, { userId: user.sub });
                nextUid = response.data?.uid ?? null;

                if (!nextUid) {
                    throw new Error('No app user found for the current Auth0 session');
                }

                // Always fetch profile to get userRole and profile completeness
                const profile = await fetchAppProfile(nextUid);

                if (isCancelled) {
                    return;
                }

                setUid(nextUid);
                setUserRole(profile.userRole);
            } catch {
                if (isCancelled) {
                    return;
                }

                setUid(null);
                setUserRole(null);
            }
        };

        void syncAppUser();

        return () => {
            isCancelled = true;
        };
    }, [api, fetchAppProfile, isLoading, user]);

    return (
        <AuthContext.Provider value={{ uid, userRole, checkProfileComplete }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};
