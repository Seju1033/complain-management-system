const API_BASE_URL = 'http://localhost:5000/api'; 

const fetchWithAuth = async (url, options = {}) => {
    const user = JSON.parse(localStorage.getItem('resolveEaseUser'));
    const token = user ? user.token : null;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
    }

    return response.json();
};

export default fetchWithAuth;