!function (t, e) {
    "object" == typeof exports && "undefined" != typeof module
      ? e(exports)
      : "function" == typeof define && define.amd
      ? define(["exports"], e)
      : e((t = t || self).GitHttp = {});
  }(this, function (t) {
    "use strict";
  
    // Utility to process an async iterable
    async function processAsyncIterable(iterable, callback) {
      for await (const chunk of iterable) {
        await callback(chunk);
      }
    }
  
    // Combine Uint8Array chunks into a single Uint8Array
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
        // Prepare the request body if available
        if (body) {
          body = await concatenateChunks(body);
        }
  
        const fetchOptions = {
          method,
          headers: {
            ...headers,
            Connection: "keep-alive",
          },
          body,
        };
  
        const response = await fetch(url, fetchOptions);
  
        if (!response.ok) {
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
                  onProgress && onProgress(bytesRead); // Report progress
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
        console.error("Request failed:", error);
        throw error;
      }
    }
  
    // Expose the request function
    t.default = { request: httpRequest };
    t.request = httpRequest;
  
    Object.defineProperty(t, "__esModule", { value: true });
  });
  