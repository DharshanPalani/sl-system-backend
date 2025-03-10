import db from './config/db.js';
import chalk from 'chalk';
import ora from 'ora';

const success = (msg) => console.log(chalk.green(`✔ ${msg}`));
const error = (msg) => console.log(chalk.red(`✖ ${msg}`));

const tableName = 'userDetails';

const checkAndCreateTable = async () => {
  const spin = ora(`Checking for ${tableName} table...`).start();
  try {
    const [rows] = await db.promise().query(`SHOW TABLES LIKE '${tableName}'`);
    if (!rows.length) {
      spin.text = `Creating ${tableName} table...`;
      await db.promise().query(`
        CREATE TABLE ${tableName} (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL
        );
      `);
      spin.succeed('Table created.');
    } else {
      spin.succeed('Table exists.');
    }
  } catch (err) {
    spin.fail('Error with table setup.');
    error(err.message);
    throw err;
  }
};

const insertUser = async (username, password) => {
  const spin = ora(`Inserting user: ${username}...`).start();
  try {
    await checkAndCreateTable();
    const [res] = await db.promise().query(
      `INSERT INTO ${tableName} (username, password) VALUES (?, ?)`,
      [username, password]
    );
    spin.succeed(`User inserted (ID: ${res.insertId})`);
  } catch (err) {
    spin.fail('Insert failed.');
    error(err.message);
  } finally {
    db.end();
  }
};

const checkConnection = async () => {
  const spin = ora('Connecting to DB...').start();
  try {
    await db.promise().query('SELECT 1');
    spin.succeed('Connected.');
    await insertUser('testuser', 'testpassword');
  } catch (err) {
    spin.fail('DB connection failed.');
    error(err.message);
  }
};

checkConnection();
