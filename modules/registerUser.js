import checkUser from './checkUser.js';
import hashPassword from './hashPassword.js';
import storeUser from './storeUser.js';

const registerUser = async (username, password) => {
    if (await checkUser(username)) throw new Error("Username already exists.");
    
    const hashedPassword = await hashPassword(password);
    return await storeUser(username, hashedPassword);
};

export default registerUser;
