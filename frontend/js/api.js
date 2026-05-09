const API_BASE_URL = '';

let USER_ID = localStorage.getItem('user_id');

async function initUser() {
    if (!USER_ID) {
        try {
            const res = await fetch(`${API_BASE_URL}/users/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: `user_${Date.now()}@example.com` })
            });
            const data = await res.json();
            USER_ID = data.id;
            localStorage.setItem('user_id', USER_ID);
        } catch (e) {
            console.error("Error creating user", e);
        }
    }
}

async function apiFetch(endpoint, options = {}) {
    if (!USER_ID && endpoint !== '/users/') {
        await initUser();
    }
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'API Error');
    }
    return res.json();
}
