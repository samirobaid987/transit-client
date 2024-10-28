import LogisticsPlugin from './share-logistics-plugin';
import { LOGISTICS_CONFIG } from './config';

// Export configured instance
export const createLogisticsPlugin = (environment = 'DEVELOPMENT') => {
    return new LogisticsPlugin({
        apiEndpoint: LOGISTICS_CONFIG.API_ENDPOINTS[environment],
        timeout: LOGISTICS_CONFIG.TIMEOUT,
        retryAttempts: LOGISTICS_CONFIG.RETRY_ATTEMPTS
    });
};

// Export the class for custom initialization
export { LogisticsPlugin };