// controllers/AuthController.js
class AuthController {
    constructor(service) {
        this.service = service;
    }

    async signup(req, res, next) {
        try {
            const { email, password, firstName, lastName, phone, userType, ...roleData } = req.body;
            
            if (!email || !password || !firstName || !lastName || !userType) {
                return res.status(400).json({ success: false, message: 'Missing required fields.' });
            }

            const result = await this.service.signup({
                email, password, firstName, lastName, phone, userType, roleData
            });

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result
            });
        } catch (err) {
            next(err);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email and password are required.' });
            }

            const result = await this.service.login(email, password);

            res.json({
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = AuthController;
