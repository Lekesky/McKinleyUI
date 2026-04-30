import { Platform } from 'react-native';
import RNEventSource from 'react-native-sse';

export type SSECallback = {
  onOpen?: () => void;
  onMessage: (data: any) => void;
  onError: (error: any) => void;
};

/**
 * Creates a Server-Sent Events connection with Authorization header support.
 * 
 * For web: Uses fetch with ReadableStream to support custom headers
 * For native: Uses RNEventSource which natively supports headers
 * 
 * @param url - The SSE endpoint URL
 * @param accessToken - The Bearer token for authentication
 * @param callbacks - Object with onOpen, onMessage, and onError callbacks
 * @returns A function to close/cleanup the connection
 */
export const createSSEConnection = (
  url: string,
  accessToken: string,
  callbacks: SSECallback
): (() => void) => {
  if (Platform.OS === 'web') {
    return createWebSSEConnection(url, accessToken, callbacks);
  } else {
    return createNativeSSEConnection(url, accessToken, callbacks);
  }
};

/**
 * Creates an SSE connection for web using the native EventSource API with fetch as fallback.
 */
function createWebSSEConnection(
  url: string,
  accessToken: string,
  callbacks: SSECallback
): () => void {
  let isClosed = false;

  // Try using fetch with ReadableStream first for header support
  const controller = new AbortController();
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

  const startFetchConnection = async () => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'text/event-stream',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`SSE connection failed with status ${response.status}`);
      }

      callbacks.onOpen?.();
      reader = response.body?.getReader() || null;

      if (!reader) {
        throw new Error('Failed to get response body reader');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (!isClosed) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsedData = JSON.parse(data);
              callbacks.onMessage(parsedData);
            } catch (parseError) {
            }
          }
        }
      }
    } catch (error) {
      if (!isClosed && error instanceof Error && error.name !== 'AbortError') {
        console.warn('Fetch-based SSE failed, attempting cleanup:', error);
        callbacks.onError(error);
      }
    }
  };

  // Start the fetch connection asynchronously
  startFetchConnection().catch(error => {
    console.error('SSE connection error:', error);
    if (!isClosed) {
      callbacks.onError(error);
    }
  });

  // Cleanup function
  return () => {
    isClosed = true;
    if (reader) {
      try {
        reader.cancel();
      } catch (e) {
        // Ignore cancel errors
      }
    }
    controller.abort();
  };
}

/**
 * Creates an SSE connection for native platforms using RNEventSource.
 * RNEventSource natively supports custom headers.
 */
function createNativeSSEConnection(
  url: string,
  accessToken: string,
  callbacks: SSECallback
): () => void {
  const sse = new RNEventSource(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  sse.addEventListener('open', () => {
    callbacks.onOpen?.();
  });

  sse.addEventListener('message', (event: any) => {
    try {
      if (event.data == null) return;
      const data = JSON.parse(event.data);
      callbacks.onMessage(data);
    } catch (parseError) {
      console.warn('SSE: Failed to parse message', parseError);
    }
  });

  sse.addEventListener('error', (error: any) => {
    callbacks.onError(error);
  });

  // Return cleanup function
  return () => {
    sse.close();
  };
}
