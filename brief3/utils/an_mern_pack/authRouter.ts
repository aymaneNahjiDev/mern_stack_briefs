import { Router, Response, NextFunction } from "express";
import User, { IUser, SafeUserType } from "../../models/User";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult, query } from "express-validator";
import { sendMail } from "./mailing";
import { TheRequest } from "./types";


const authRouter = Router()


const authenticateToken = (req: TheRequest, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access Denied');
    }

    try {
        const verified = jwt.verify(token, process.env.JWS_SECRET_KEY || '') as SafeUserType;
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

// User registration
authRouter.post('/register', [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isStrongPassword()
], async (req: TheRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).send('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });

        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

// User login
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid email or password');
        }

        const accessToken = jwt.sign({ _id: user._id, name: user.name, email: user.email }, process.env.JWt_ACCESS_TOKEN_SECRET_KEY || '', { expiresIn: '1h' });
        const refreshToken = jwt.sign({ _id: user._id, name: user.name, email: user.email }, process.env.JWt_REFRESH_TOKEN_SECRET_KEY || '', { expiresIn: '7h' });
        res.json({ accessToken,refreshToken });
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});

// Password reset
authRouter.post('/password/reset', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('User with this email does not exist');
        }

        const resetToken = jwt.sign({ _id: user._id,name: user.name, email: user.email }, process.env.JWt_RESET_PASSWORD_SECRET_KEY || '', { expiresIn: '1h' });

        const resetUrl = `${process.env.HOST}/auth/password/reset/confirm?token=${resetToken}`;


          await sendMail({
                to: user.email,
                subject: 'Password Reset',
                body: `<p>Click <a href="${resetUrl}">here</a> to reset your password</p>`
            });

        res.send('Password reset link sent');
    } catch (error) {
        res.status(500).send('Error sending reset email');
    }
});

// Password reset confirm
authRouter.post('/password/reset/confirm',
    [
        body('newPassword').isStrongPassword(),
        query('token').isString().notEmpty(),
    ]
    , async (req:TheRequest, res:Response) => {
    const { new_password } = req.body;
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token as string, process.env.JWt_RESET_PASSWORD_SECRET_KEY || '') as SafeUserType
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(400).send('Invalid token or user does not exist');
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);
        user.password = hashedPassword;
        await user.save();

        res.send('Password has been reset');
    } catch (error) {
        res.status(500).send('Error resetting password');
    }
});

// User details
authRouter.get('/user', authenticateToken, async (req:TheRequest, res) => {
    try {
        const user = await User.findById(req.user?._id);
        res.json(user);
    } catch (error) {
        res.status(500).send('Error fetching user details');
    }
});

// Password change
authRouter.post('/password/change', authenticateToken,
    [
        body('old_password').isString().notEmpty(),
        body('new_password').isStrongPassword(),
    ]
    , async (req:TheRequest, res:Response) => {
    const { old_password, new_password } = req.body;

    try {
        const user = await User.findById(req.user?._id);
        if (user) {

            const isPasswordValid = await bcrypt.compare(old_password, user.password);
            if (!isPasswordValid) {
                return res.status(400).send('Old password is incorrect');
            }

            const hashedPassword = await bcrypt.hash(new_password, 10);
            user.password = hashedPassword;
            await user.save();

            res.send('Password has been changed');
        }

    } catch (error) {
        res.status(500).send('Error changing password');
    }
});

// Token verification
authRouter.post('/token/verify', (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWS_SECRET_KEY || '') as SafeUserType;
        res.json({ valid: true, decoded });
    } catch (error) {
        res.json({ valid: false, error: 'Invalid token' });
    }
});

// Token refresh
authRouter.post('/token/refresh', (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWS_SECRET_KEY || '', { ignoreExpiration: true }) as SafeUserType;
        const newAccessToken = jwt.sign({ _id: decoded._id, name: decoded.name, email: decoded.email }, process.env.JWt_ACCESS_TOKEN_SECRET_KEY || '', { expiresIn: '1h' });
        const newRefreshToken = jwt.sign({ _id: decoded._id, name: decoded.name, email: decoded.email }, process.env.JWt_REFRESH_TOKEN_SECRET_KEY || '', { expiresIn: '7h' });
        res.json({ accessToken: newAccessToken,refreshToken:newRefreshToken });
    } catch (error) {
        res.status(400).send('Invalid token');
    }
});

// User logout
authRouter.post('/logout', authenticateToken, (req, res) => {
    res.send('User logged out');
});

export default authRouter;