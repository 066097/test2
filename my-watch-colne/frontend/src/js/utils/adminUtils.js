/**
 * Admin Authentication Utilities
 * Contains shared functions for admin authentication and security
 */

// Hash function for password security
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Password validation
export function validatePassword(password) {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
        isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
        checks: {
            minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            hasSpecialChar
        }
    };
}

// Session management
export function createSession() {
    const sessionToken = Date.now().toString(36) + Math.random().toString(36).substr(2);
    localStorage.setItem('adminSessionToken', sessionToken);
    localStorage.setItem('adminSessionStart', Date.now().toString());
    return sessionToken;
}

export function validateSession() {
    const sessionToken = localStorage.getItem('adminSessionToken');
    const sessionStart = Number(localStorage.getItem('adminSessionStart') || '0');
    const SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 hours
    
    if (!sessionToken || !sessionStart) {
        return false;
    }
    
    // Check session age
    if (Date.now() - sessionStart > SESSION_DURATION) {
        clearSession();
        return false;
    }
    
    return true;
}

export function clearSession() {
    localStorage.removeItem('adminSessionToken');
    localStorage.removeItem('adminSessionStart');
}

// Rate limiting for login attempts
export function getLoginAttempts() {
    return Number(localStorage.getItem('adminLoginAttempts') || '0');
}

export function setLoginAttempts(val) {
    localStorage.setItem('adminLoginAttempts', val);
}

export function blockLogin() {
    localStorage.setItem('adminLoginBlocked', '1');
    localStorage.setItem('adminLoginBlockedAt', Date.now());
}

export function isLoginBlocked() {
    const blocked = localStorage.getItem('adminLoginBlocked') === '1';
    if (!blocked) return false;
    
    const blockedAt = Number(localStorage.getItem('adminLoginBlockedAt') || '0');
    const BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes
    
    if (Date.now() - blockedAt > BLOCK_DURATION) {
        localStorage.removeItem('adminLoginBlocked');
        localStorage.removeItem('adminLoginBlockedAt');
        setLoginAttempts(0);
        return false;
    }
    return true;
}

export function getBlockTimeLeft() {
    const blockedAt = Number(localStorage.getItem('adminLoginBlockedAt') || '0');
    const BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes
    const msLeft = BLOCK_DURATION - (Date.now() - blockedAt);
    return Math.max(0, msLeft);
}

// Recovery code management
export function generateRecoveryCode() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return Array(12).fill(0)
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join('')
        .match(/.{1,4}/g)
        .join('-');
}

export function generateRecoveryCodes(count = 8) {
    return Array(count).fill(0).map(() => generateRecoveryCode());
}

export function storeRecoveryCodes(codes) {
    localStorage.setItem('adminRecoveryCodes', JSON.stringify(codes));
}

export function getRecoveryCodes() {
    try {
        return JSON.parse(localStorage.getItem('adminRecoveryCodes') || '[]');
    } catch (e) {
        console.error('Error parsing recovery codes:', e);
        return [];
    }
}

export function removeRecoveryCode(usedCode) {
    const codes = getRecoveryCodes();
    const remainingCodes = codes.filter(code => code !== usedCode);
    storeRecoveryCodes(remainingCodes);
    return remainingCodes;
}

// Check if using default credentials
export function isUsingDefaultCredentials() {
    return localStorage.getItem('adminUsername') === 'admin';
}

// Initialize admin credentials if not set
export async function initializeAdminCredentials() {
    if (!localStorage.getItem('adminHash')) {
        const defaultUsername = 'admin';
        const defaultPassword = 'Admin@123456';
        const hash = await hashPassword(defaultUsername + ':' + defaultPassword);
        localStorage.setItem('adminHash', hash);
        localStorage.setItem('adminUsername', defaultUsername);
        
        // Generate initial recovery codes
        const codes = generateRecoveryCodes();
        storeRecoveryCodes(codes);
    }
}