// services/AuthService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    constructor(repo) {
        this.repo = repo;
    }

    async signup(userData) {
        // Check if user exists
        const existingUser = await this.repo.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('User already exists with this email.');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        userData.passwordHash = await bcrypt.hash(userData.password, salt);

        // Create user
        const user = await this.repo.createUser(userData);
        
        // Generate token
        const token = this.generateToken(user);
        return { user, token };
    }

    async login(email, password) {
        const user = await this.repo.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password.');
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new Error('Invalid email or password.');
        }

        const token = this.generateToken(user);
        
        // Remove password hash from response
        const { password_hash, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }

    generateToken(user) {
        return jwt.sign(
            { 
                user_id: user.user_id, 
                email: user.email, 
                user_type: user.user_type 
            },
            process.env.JWT_SECRET || 'egrocer_secret_key_123',
            { expiresIn: '24h' }
        );
    }
}

module.exports = AuthService;
