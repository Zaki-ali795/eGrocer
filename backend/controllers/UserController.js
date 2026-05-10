// controllers/UserController.js

class UserController {
    constructor(userService) {
        this.userService = userService;

        this.getProfile = this.getProfile.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
    }

    async getProfile(req, res, next) {
        try {
            const userId = req.params.id || req.query.userId || (req.user && req.user.id) || 1;
            const profile = await this.userService.getUserProfile(userId);
            res.json({ success: true, data: profile });
        } catch (err) {
            next(err);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const userId = req.params.id || req.body.userId || (req.user && req.user.id) || 1;
            const updatedProfile = await this.userService.updateUserProfile(userId, req.body);
            res.json({ success: true, data: updatedProfile });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = UserController;
