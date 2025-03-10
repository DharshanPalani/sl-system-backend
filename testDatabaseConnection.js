import db from './config/db.js';
import chalk from 'chalk';
import ora from 'ora';

const success = (msg) => console.log(chalk.green(`✔ ${msg}`));
const error = (msg) => console.log(chalk.red(`✖ ${msg}`));

const collectionName = 'userDetails';

const checkAndCreateCollection = async () => {
    const spin = ora(`Checking for ${collectionName} collection...`).start();
    try {
        const collections = await db.listCollections({ name: collectionName }).toArray();
        if (collections.length === 0) {
            spin.text = `Creating ${collectionName} collection...`;
            await db.createCollection(collectionName);
            spin.succeed('Collection created.');
        } else {
            spin.succeed('Collection exists.');
        }
    } catch (err) {
        spin.fail('Error with collection setup.');
        error(err.message);
        throw err;
    }
};

const insertUser = async (username, password) => {
    const spin = ora(`Inserting user: ${username}...`).start();
    try {
        await checkAndCreateCollection();
        const res = await db.collection(collectionName).insertOne({ username, password });
        spin.succeed(`User inserted (ID: ${res.insertedId})`);
    } catch (err) {
        spin.fail('Insert failed.');
        error(err.message);
    }
};

const checkConnection = async () => {
    const spin = ora('Connecting to DB...').start();
    try {
        await db.command({ ping: 1 });
        spin.succeed('Connected.');
        await insertUser('testuser', 'testpassword');
    } catch (err) {
        spin.fail('DB connection failed.');
        error(err.message);
    }
};

checkConnection();
