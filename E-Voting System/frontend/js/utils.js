// Shared Utilities
function showMessage(msg) {
    const box = document.getElementById('notification-box');
    if (!box) return alert(msg);
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${msg}</span>`;
    box.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('voter_id');
    window.location.href = 'login.html';
}

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
        window.location.href = 'login.html';
    }
    return token;
}

// Global Nav setup
document.addEventListener('DOMContentLoaded', () => {
    const userIdDisplay = document.getElementById('user-id-display');
    const voterId = localStorage.getItem('voter_id');
    if (userIdDisplay && voterId) {
        userIdDisplay.innerText = voterId === 'admin' ? "Officer: 9901" : `ID: ${voterId}`;
    }
});
