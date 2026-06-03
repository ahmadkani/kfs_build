// GitHttp.js

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

async function httpRequest({ onProgress, url, method = "GET", headers = {}, body, corsProxy }) {
  try {
    if (body) {
      body = await concatenateChunks(body);
    }

    // Handle CORS Proxy
    let targetUrl = url;
    if (corsProxy) {
      targetUrl = corsProxy.replace(/\/$/, '') + '/' + url.replace(/^https?:\/\//, '');
    }

    console.log(`[GitHttp] -> ${method} ${targetUrl}`);

    const fetchOptions = {
      method,
      headers: { ...headers },
      body,
    };

    const response = await fetch(targetUrl, fetchOptions);

    console.log(`[GitHttp] <- ${response.status} Length: ${response.headers.get('Content-Length')}`);

    // DO NOT THROW HERE. Return the status code so isomorphic-git can handle 401.
    const reader = response.body?.getReader();
    const responseStream = reader
      ? {
          async *[Symbol.asyncIterator]() {
            let bytesRead = 0;
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              bytesRead += value.byteLength;
              if (onProgress) onProgress({ loaded: bytesRead });
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
//# sourceMappingURL=GitHttp-CuaJ3FqT.js.map
