import { pool } from "./config/db.js";
import readlineSync from "readline-sync";
import chalk from "chalk";
import ora from "ora";

async function runQuery(query) {
    const spinner = ora("Executing query...").start();
    try {
        const client = await pool.connect();
        const result = await client.query(query);
        client.release();
        spinner.succeed(chalk.green("Query executed successfully!"));
        console.table(result.rows);
    } catch (err) {
        spinner.fail(chalk.red("Query failed!"));
        console.error(chalk.red(err.message));
    }
}

async function main() {
    console.log(chalk.blue.bold("\nPostgreSQL CLI Tool\n"));
    while (true) {
        const query = readlineSync.question(chalk.yellow("Enter SQL query:"));

        if (query.toLowerCase() === "exit") {
            console.log(chalk.green("\nGoodbye!\n"));
            process.exit(0);
        }

        await runQuery(query);
    }
}

main();
