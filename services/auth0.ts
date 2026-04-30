import { Platform } from 'react-native';
import type {
  ClearSessionParameters,
  NativeAuthorizeOptions,
  NativeClearSessionOptions,
  WebAuthorizeParameters,
} from 'react-native-auth0';

const FALLBACK_AUTH0_DOMAIN = 'dev-japh4s2lm51gcj48.us.auth0.com';
const FALLBACK_AUTH0_CLIENT_ID = 'AF3gFAc6aoh0kXNk6STNm7mDqQmwspvy';
const FALLBACK_AUTH0_AUDIENCE = 'https://mckinleysgrill.com/';
const FALLBACK_AUTH0_SCOPE = 'openid profile email offline_access';
const FALLBACK_AUTH0_CUSTOM_SCHEME = 'mckinleygrill';

const resolveConfigValue = (...values: (string | undefined)[]) => {
  return values.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim() ?? '';
};

export const auth0Config = {
  domain: resolveConfigValue(
    process.env.EXPO_PUBLIC_AUTH0_DOMAIN,
    process.env.AUTH0_DOMAIN,
    FALLBACK_AUTH0_DOMAIN
  ),
  clientId: resolveConfigValue(
    process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID,
    process.env.AUTH0_CLIENT_ID,
    FALLBACK_AUTH0_CLIENT_ID
  ),
  audience: resolveConfigValue(
    process.env.EXPO_PUBLIC_AUTH0_AUDIENCE,
    process.env.AUTH0_AUDIENCE,
    FALLBACK_AUTH0_AUDIENCE
  ),
  scope: resolveConfigValue(
    process.env.EXPO_PUBLIC_AUTH0_SCOPE,
    process.env.AUTH0_SCOPE,
    FALLBACK_AUTH0_SCOPE
  ),
  customScheme: resolveConfigValue(
    process.env.EXPO_PUBLIC_AUTH0_CUSTOM_SCHEME,
    process.env.AUTH0_CUSTOM_SCHEME,
    FALLBACK_AUTH0_CUSTOM_SCHEME
  ),
} as const;

export const getAuth0ProviderProps = () => {
  const baseProviderProps = {
    domain: auth0Config.domain,
    clientId: auth0Config.clientId,
  };

  if (Platform.OS === 'web') {
    return {
      ...baseProviderProps,
      audience: auth0Config.audience,
      scope: auth0Config.scope,
      useRefreshTokens: true,
      cacheLocation: 'localstorage' as const,
    };
  }

  return baseProviderProps;
};

export const getAuth0AuthorizeParameters = (): WebAuthorizeParameters => ({
  audience: auth0Config.audience,
  scope: auth0Config.scope,
});

export const getAuth0AuthorizeOptions = (): NativeAuthorizeOptions | undefined => {
  if (Platform.OS === 'web') {
    return undefined;
  }

  return {
    customScheme: auth0Config.customScheme,
  };
};

export const getAuth0ClearSessionParameters = (): ClearSessionParameters => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return {
      returnToUrl: window.location.origin,
    };
  }

  return {};
};

export const getAuth0ClearSessionOptions = (): NativeClearSessionOptions | undefined => {
  if (Platform.OS === 'web') {
    return undefined;
  }

  return {
    customScheme: auth0Config.customScheme,
  };
};

export const getAuth0CredentialsArgs = (forceRefresh: boolean = false) => {
  return [
    auth0Config.scope,
    0,
    { audience: auth0Config.audience },
    forceRefresh,
  ] as const;
};
