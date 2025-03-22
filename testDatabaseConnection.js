import { pool } from './config/db.js';
import chalk from 'chalk';
import ora from 'ora';

const success = (msg) => console.log(chalk.green(`✔ ${msg}`));
const error = (msg) => console.log(chalk.red(`✖ ${msg}`));

const createUsersTable = async () => {
    const spin = ora('Checking for users table...').start();
    try {
        const client = await pool.connect();

        // Check if "users" table exists
        const checkTableQuery = `
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = quote_ident('users')
            );
        `;
        const res = await client.query(checkTableQuery);

        if (!res.rows[0].exists) {
            spin.text = 'Creating users table...';
            await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(255) UNIQUE NOT NULL,
                    password TEXT NOT NULL
                );
            `);
            spin.succeed('Users table created.');
        } else {
            spin.succeed('Users table already exists.');
        }

        client.release();
    } catch (err) {
        spin.fail('Error checking/creating users table.');
        error(err.message);
        throw err;
    }
};

const insertUser = async (username, password) => {
    const spin = ora(`Inserting user: ${username}...`).start();
    try {
        await createUsersTable(); // Ensure table exists

        const client = await pool.connect();
        const insertQuery = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id;`;
        const res = await client.query(insertQuery, [username, password]);
        client.release();

        spin.succeed(`User inserted (ID: ${res.rows[0].id})`);
    } catch (err) {
        spin.fail('Insert failed.');
        error(err.message);
    }
};

const checkConnection = async () => {
    const spin = ora('Connecting to DB...').start();
    try {
        const client = await pool.connect();
        spin.succeed('✔ Connected to PostgreSQL.');
        client.release();

        await insertUser('testuser', 'testpassword'); // Test insert
    } catch (err) {
        spin.fail('✖ DB connection failed.');
        error(err.message);
    } finally {
        process.exit(0);
    }
};

checkConnection();
