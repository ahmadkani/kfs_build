import {Logger} from "./../LoggerES6.js";
import {config} from "./../../configES6.js";
    const logger = new Logger(config.logging.swUtils);
  
    function consoleDotLog(...args) {
      logger.consoleDotLog("[ SWUtils ]", ...args);
    }
  
    function consoleDotError(...args) {
      logger.consoleDotError("[ SWUtils ]", ...args);
    }

    class swUtils {
      constructor() {

      }
  
    async fetchWithServiceWorker(operation, args) {
      consoleDotLog('Starting fetchWithServiceWorker with operation:', operation, 'and args:', args);
      try {
        const url = new URL('/git', self.location.origin).toString();
        consoleDotLog('Constructed URL for fetch:', url);

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({ operation, args }),
            headers: { 'Content-Type': 'application/json' }
        };
        consoleDotLog('Request options:', requestOptions);

        const response = await fetch(url, requestOptions);
        consoleDotLog('Fetch response received:', response);

        let jsonResponse;
        try {
            jsonResponse = await response.json();
            consoleDotLog('Parsed JSON response:', jsonResponse);
        } catch (jsonError) {
            consoleDotError('Error parsing JSON response:', jsonError);
            throw new Error('Response is not valid JSON');
        }

        if (!response.ok) {
            let errorMessage = `Fetch failed with status: ${response.status}`;
            consoleDotLog('Response status is not OK:', response.status);

            switch (response.status) {
              case 400:
                errorMessage = "Bad Request: The server could not understand the request.";
                break;
              case 401:
                errorMessage = "Unauthorized: Authentication is required or has failed.";
                break;
              case 403:
                errorMessage = "Forbidden: You do not have permission to access this resource.";
                break;
              case 404:
                errorMessage = "Not Found: The requested resource could not be found.";
                break;
              case 500:
                errorMessage = "Internal Server Error: The server encountered an error.";
                break;
              case 502:
                errorMessage = "Bad Gateway: The server received an invalid response from the upstream server.";
                break;
              case 503:
                errorMessage = "Service Unavailable: The server is currently unable to handle the request.";
                break;
              case 504:
                errorMessage = "Gateway Timeout: The server did not receive a timely response from the upstream server.";
                break;
              default:
                errorMessage = `Unexpected status code: ${response.status}`;
            }

            consoleDotError('Error message based on status code:', errorMessage);
            consoleDotError('Response details:', jsonResponse.details);
            throw new Error(JSON.stringify(jsonResponse.details));
        }

        consoleDotLog('Fetch completed successfully with response:', jsonResponse);
        return jsonResponse;

      } catch (error) {
        consoleDotError('Fetch error:', error);
        throw error;
      }
    };

        async sendMessageToChannel(message, channelID= 'worker-channel') {
            return new Promise((resolve) => {
                const broadcastChannel = new BroadcastChannel(channelID);
            
                broadcastChannel.onmessage = (event) => {
                if (event.data.operation === `${message.operation}`) {
                    broadcastChannel.close();
                    resolve(event.data);
                }
                };
        
                broadcastChannel.postMessage(message);
            });
        }
    };

    export default swUtils;
  
