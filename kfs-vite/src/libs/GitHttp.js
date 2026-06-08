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

    // DEBUG: Log request
    console.log(`[GitHttp] -> ${method} ${url}`);

    const fetchOptions = {
      method,
      headers: {
        // IMPORTANT: Do NOT hardcode 'Accept' here.
        // Let isomorphic-git manage the headers via the 'headers' argument.
        ...headers, 
        'Connection': 'keep-alive',
      },
      body,
    };

    const response = await fetch(url, fetchOptions);

    // DEBUG: Log response
    console.log(`[GitHttp] <- ${response.status} Length: ${response.headers.get('Content-Length')}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[GitHttp] Error Body: ${errorText}`);
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    const responseStream = reader
      ? {
          async *[Symbol.asyncIterator]() {
            let bytesRead = 0;
            let isFirstChunk = true;
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              
              // DEBUG: Check packfile header on first chunk
              if (isFirstChunk) {
                const header = new TextDecoder().decode(value.slice(0, 4));
                console.log(`[GitHttp] Packfile Header: "${header}"`);
                isFirstChunk = false;
              }

              bytesRead += value.byteLength;
              if (onProgress) {
                 onProgress({ loaded: bytesRead });
              }
              yield value;
            }
            console.log(`[GitHttp] Stream finished. Total bytes: ${bytesRead}`);
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

export default { request: httpRequest };
export { httpRequest as request };