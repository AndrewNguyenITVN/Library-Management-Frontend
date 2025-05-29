const TIMEOUT_DURATION = 10000; // 10 seconds
const MAX_RETRIES = 3;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const authFetch = async (url, options = {}, retryCount = 0) => {
    const token = localStorage.getItem('jwtToken');

    const defaultHeaders = {};
    // Only set default Content-Type if not FormData
    if (!(options.body instanceof FormData)) {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    const headers = {
        ...defaultHeaders,
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // If it's FormData, let the browser set the Content-Type header
    // by not including it in the fetch options if it was auto-added
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

        const response = await fetch(url, {
            ...options,
            headers,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Handle token expiration or invalid token
        if (response.status === 401 || response.status === 403) {
            // Redirect to login or show relogin message
            localStorage.removeItem('jwtToken'); // Clear invalid token
            // You might want to use useNavigate from react-router-dom here,
            // but this utility function is outside a React component.
            // A common approach is to dispatch a custom event or use a global state (like Context API or Redux)
            // to notify the app to redirect. For simplicity, we'll alert and redirect.
            alert('Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
            window.location.href = '/login'; // Or your login route
            // Throw an error to stop further processing in the calling function
            throw new Error('Unauthorized');
        }

        return response;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timeout. Vui lòng thử lại sau.');
        }

        // Retry logic for network errors
        if (retryCount < MAX_RETRIES && (
            error.name === 'TypeError' || // Network error
            error.message === 'Failed to fetch' ||
            error.message.includes('NetworkError')
        )) {
            await sleep(1000 * (retryCount + 1)); // Exponential backoff
            return authFetch(url, options, retryCount + 1);
        }

        throw error;
    }
};

export default authFetch; 