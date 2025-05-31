const express = require('express');
const router = express.Router();

// Placeholder: Replace with real DB/user model
const DEMO_ADMIN = {
  username: 'admin',
  password: 'Admin@123456', // In production, use hashed passwords!
  twoFactorEnabled: true,
  twoFactorSecret: 'DEMOSECRET',
  recoveryCodes: [
    'ABCD-1234-EFGH',
    '5678-IJKL-9012',
    'MNOP-3456-QRST',
    '7890-UVWX-YZ12',
    '3456-7890-ABCD',
    'EFGH-1234-IJKL',
    'MNOP-5678-QRST',
    'UVWX-9012-YZ12'
  ]
};

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === DEMO_ADMIN.username && password === DEMO_ADMIN.password) {
    // Set a secure, HTTP-only cookie for session
    res.cookie('admin_session', 'demo-session-token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: true
    });
    return res.json({ success: true, twoFactorEnabled: DEMO_ADMIN.twoFactorEnabled });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// POST /api/auth/2fa
router.post('/2fa', (req, res) => {
  const { code } = req.body;
  // In production, verify TOTP code using the secret
  if (code === '123456') {
    res.cookie('admin_2fa', 'demo-2fa-token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: true
    });
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, message: 'Invalid 2FA code' });
});

// POST /api/auth/recovery
router.post('/recovery', (req, res) => {
  const { code } = req.body;
  if (DEMO_ADMIN.recoveryCodes.includes(code)) {
    // Remove used code in real DB
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, message: 'Invalid recovery code' });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('admin_session');
  res.clearCookie('admin_2fa');
  res.json({ success: true });
});

module.exports = router;
