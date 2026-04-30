import { Platform } from 'react-native';

export type AuthRedirectAction = 'login' | 'signup';

const AUTH_REDIRECT_ACTION_KEY = 'mckinley.auth_redirect_action';

const canUseSessionStorage = () =>
  Platform.OS === 'web' &&
  typeof window !== 'undefined' &&
  typeof window.sessionStorage !== 'undefined';

export const storeAuthRedirectAction = (action: AuthRedirectAction) => {
  if (!canUseSessionStorage()) {
    return;
  }

  try {
    window.sessionStorage.setItem(AUTH_REDIRECT_ACTION_KEY, action);
  } catch {
    return;
  }
};

export const clearAuthRedirectAction = () => {
  if (!canUseSessionStorage()) {
    return;
  }

  try {
    window.sessionStorage.removeItem(AUTH_REDIRECT_ACTION_KEY);
  } catch {
    return;
  }
};

export const consumeAuthRedirectAction = (): AuthRedirectAction | null => {
  if (!canUseSessionStorage()) {
    return null;
  }

  try {
    const action = window.sessionStorage.getItem(AUTH_REDIRECT_ACTION_KEY);
    window.sessionStorage.removeItem(AUTH_REDIRECT_ACTION_KEY);

    return action === 'login' || action === 'signup' ? action : null;
  } catch {
    return null;
  }
};
