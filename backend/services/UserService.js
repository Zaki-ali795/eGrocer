// services/UserService.js

class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async getUserProfile(userId) {
        const profile = await this.userRepository.getUserProfile(userId);
        if (!profile) {
            throw new Error('User not found');
        }
        return {
            id: profile.user_id,
            firstName: profile.first_name,
            lastName: profile.last_name,
            phone: profile.user_phone,
            email: profile.email,
            address: profile.address_line1,
            city: profile.city,
            state: profile.state,
            postalCode: profile.postal_code
        };
    }

    async updateUserProfile(userId, profileData) {
        // Basic validation
        if (!profileData.firstName || !profileData.lastName) {
            throw new Error('First name and last name are required');
        }
        await this.userRepository.updateUserProfile(userId, profileData);
        return await this.getUserProfile(userId);
    }
}

module.exports = UserService;
