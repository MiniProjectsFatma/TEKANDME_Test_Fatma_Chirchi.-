const crypto = require('crypto');

function generateRandomKey(length = 32) {
    return crypto.randomBytes(length).toString('base64');
}

const keys = {
    APP_KEYS: `${generateRandomKey()},${generateRandomKey()},${generateRandomKey()},${generateRandomKey()}`,
    API_TOKEN_SALT: generateRandomKey(),
    ADMIN_JWT_SECRET: generateRandomKey(),
    TRANSFER_TOKEN_SALT: generateRandomKey(),
    JWT_SECRET: generateRandomKey()
};

console.log('Add these to your .env file:\n');
Object.entries(keys).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
});
