const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendVerificationEmail } = require('../utils/email');

const collegeDomains = {
    'NIT Calicut': 'nitc.ac.in',
    'NIT Trichy': 'nitt.edu',
    'IIT Bombay': 'iitb.ac.in',
    'IIT Delhi': 'iitd.ac.in',
    'Chandigarh University': 'cuchd.in',
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
router.post('/register', async (req, res) => {
    const { name, email, password, college } = req.body;

    try {
        if (!college || !collegeDomains[college]) {
            return res.status(400).json({ message: 'Invalid college selection' });
        }

        const requiredDomain = collegeDomains[college];
        if (!email.endsWith(`@${requiredDomain}`)) {
            return res.status(400).json({ message: `Email must end with @${requiredDomain}` });
        }

        const userExists = await User.findOne({ email });

        if (userExists && userExists.emailVerified) {
            return res.status(400).json({ message: 'User already exists' });
        }

        let user = userExists;
        if (userExists && !userExists.emailVerified) {
            // Update password/college and resend verification
            userExists.password = password;
            userExists.college = college;
            userExists.emailVerified = false;
            user = await userExists.save();
        } else {
            user = await User.create({
                name,
                email,
                password,
                college,
                emailVerified: false,
            });
        }

        const verifyToken = jwt.sign({ id: user._id, purpose: 'verify' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const appBase = process.env.APP_BASE_URL || `${req.protocol}://${req.get('host')}`;
        const verifyLink = `${appBase}/api/auth/verify/${verifyToken}`;
        try {
            await sendVerificationEmail({ to: user.email, link: verifyLink });
        } catch (err) {
            console.error('Email send failed', err.message);
        }
        res.status(201).json({
            message: 'Verification email sent. Please verify to activate your account.',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @desc    Authenticate a user
 * @route   POST /api/auth/login
 * @access  Public
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (!user.emailVerified) {
                return res.status(403).json({ message: 'Email not verified. Please check your inbox.' });
            }
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                interests: user.interests,
                college: user.college,
                emailVerified: user.emailVerified,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @desc    Verify email
 * @route   GET /api/auth/verify/:token
 * @access  Public
 */
router.get('/verify/:token', async (req, res) => {
    try {
        const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
        if (decoded.purpose !== 'verify') {
            return res.status(400).json({ message: 'Invalid verification token' });
        }
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.emailVerified = true;
        await user.save();
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        const html = `
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <title>Email Verified | PeerConnect</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; margin:0; padding:0; display:flex; align-items:center; justify-content:center; min-height:100vh; }
              .card { background:#fff; border-radius:16px; padding:40px; max-width:420px; width:90%; box-shadow:0 20px 50px rgba(15,23,42,0.08); text-align:center; animation: fadeIn 0.5s ease-out; }
              .icon { width: 64px; height: 64px; background: #ecfeff; color: #0ea5e9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 32px; }
              h1 { margin:0 0 12px; color:#0f172a; font-size:24px; font-weight: 700; }
              p { margin:0 0 24px; color:#64748b; line-height:1.6; }
              .redirect-text { font-size: 14px; color: #94a3b8; }
              @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            </style>
            <script>
                setTimeout(() => {
                    window.location.href = '${frontendUrl}/login?verified=1';
                }, 3000);
            </script>
          </head>
          <body>
            <div class="card">
              <div class="icon">✓</div>
              <h1>Email Verified!</h1>
              <p>Your email has been successfully verified. You are now ready to connect.</p>
              <p class="redirect-text">Redirecting to login in 3 seconds...</p>
            </div>
          </body>
        </html>`;

        res.status(200).send(html);
    } catch (error) {
        res.status(400).json({ message: 'Verification failed' });
    }
});

/**
 * @desc    Get user data
 * @route   GET /api/auth/me
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        interests: req.user.interests,
        college: req.user.college,
        emailVerified: req.user.emailVerified,
    });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/me
 * @access  Private
 */
router.put('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.avatar = req.body.avatar || user.avatar;
        user.interests = Array.isArray(req.body.interests)
            ? req.body.interests
            : (req.body.interests ? String(req.body.interests).split(',').map(i => i.trim()).filter(Boolean) : user.interests);

        if (req.body.college) {
            const col = req.body.college;
            if (!collegeDomains[col]) {
                return res.status(400).json({ message: 'Invalid college selection' });
            }
            const requiredDomain = collegeDomains[col];
            if (!user.email.endsWith(`@${requiredDomain}`)) {
                return res.status(400).json({ message: `Email must end with @${requiredDomain}` });
            }
            user.college = col;
        }

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            interests: updatedUser.interests,
            college: updatedUser.college,
            emailVerified: updatedUser.emailVerified,
            token: generateToken(updatedUser._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
