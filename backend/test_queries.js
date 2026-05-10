const { getPool } = require('./config/db');
const AdminRepository = require('./repositories/AdminRepository');

(async () => {
    try {
        const pool = await getPool();
        const repo = new AdminRepository(pool);

        console.log('Testing getPlatformStats...');
        const stats = await repo.getPlatformStats();
        console.log('Stats:', stats);

        console.log('Testing getRevenueHistory...');
        const history = await repo.getRevenueHistory();
        console.log('History:', history);

        console.log('Testing getTopCategories...');
        const cats = await repo.getTopCategories();
        console.log('Categories:', cats);

        console.log('Testing getRecentActivity...');
        const activity = await repo.getRecentActivity();
        console.log('Activity:', activity);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
})();
