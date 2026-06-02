// Utility to combine chunks
async function concatenateChunks(chunks) {
  const buffers = [];
  let totalLength = 0;
  for await (const chunk of chunks) {
    buffers.push(chunk);
    totalLength += chunk.byteLength;
  }
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const buffer of buffers) {
    combined.set(buffer, offset);
    offset += buffer.byteLength;
  }
  return combined;
}

// Enhanced HTTP request handler
async function httpRequest({ onProgress, url, method = "GET", headers = {}, body }) {
  try {
    // Prepare the request body
    if (body) {
      body = await concatenateChunks(body);
    }

    // DEBUG: Log request details
    console.log(`[GitHttp] Requesting ${method} ${url}`);
    console.log('[GitHttp] Headers:', headers);

    const fetchOptions = {
      method,
      headers: {
        // FIX: Ensure 'Accept' header exists for Git Smart HTTP
        // This is required for /info/refs?service=git-upload-pack
        'Accept': 'application/x-git-upload-pack-advertisement',
        
        // Merge headers provided by isomorphic-git
        ...headers,
        
        // Connection header (browsers usually ignore this, but safe to keep)
        'Connection': 'keep-alive',
      },
      body,
    };

    const response = await fetch(url, fetchOptions);

    // DEBUG: Log response status
    console.log(`[GitHttp] Response Status: ${response.status}`);

    if (!response.ok) {
      // Attempt to read the error body for more info
      const errorText = await response.text();
      console.error(`[GitHttp] Error Body: ${errorText}`);
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    const responseStream = reader
      ? {
          async *[Symbol.asyncIterator]() {
            let bytesRead = 0;
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              bytesRead += value.byteLength;
              if (onProgress) {
                 onProgress({ loaded: bytesRead });
              }
              yield value;
            }
            reader.releaseLock();
          },
        }
      : [new Uint8Array(await response.arrayBuffer())];

    const responseHeaders = {};
    for (const [key, value] of response.headers.entries()) {
      responseHeaders[key] = value;
    }

    return {
      url: response.url,
      method: response.method,
      statusCode: response.status,
      statusMessage: response.statusText,
      body: responseStream,
      headers: responseHeaders,
    };
  } catch (error) {
    console.error("[GitHttp] Request failed:", error);
    throw error;
  }
}

const GitHttp = { request: httpRequest };

export { GitHttp as default, httpRequest as request };
//# sourceMappingURL=GitHttp-DuBjIlXM.js.map
