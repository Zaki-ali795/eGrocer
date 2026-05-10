
const axios = require('axios');

const userId = '6';
const productId = 53; // Tomato
const baseUrl = 'http://localhost:5000/api';

async function testWishlist() {
    try {
        console.log('--- Initial Wishlist ---');
        const initial = await axios.get(`${baseUrl}/wishlist`, { headers: { 'X-User-Id': userId } });
        console.log('Count:', initial.data.data.length);

        console.log('\n--- Toggling Wishlist ---');
        const toggle = await axios.post(`${baseUrl}/wishlist/toggle`, { productId }, { headers: { 'X-User-Id': userId } });
        console.log('Action:', toggle.data.action);

        console.log('\n--- Final Wishlist ---');
        const final = await axios.get(`${baseUrl}/wishlist`, { headers: { 'X-User-Id': userId } });
        console.log('Count:', final.data.data.length);
    } catch (err) {
        console.error('Error:', err.response ? err.response.data : err.message);
    }
}

testWishlist();
