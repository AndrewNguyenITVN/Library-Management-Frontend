const authFetch = async (url, options = {}) => {
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

    const response = await fetch(url, {
        ...options,
        headers,
    });

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
};

export default authFetch; 