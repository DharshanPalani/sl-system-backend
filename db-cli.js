import { pool } from "./config/db.js";
import fs from "fs";
import os from "os";
import path from "path";
import { spawn } from "child_process";
import readlineSync from "readline-sync";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

const CONFIG_FILE_PATH = "./config.json";

// Retrieve the preferred text editor from config.json, defaulting to Vim if not set
function getPreferredEditor() {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
        const config = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, "utf-8"));
        return config.defaultEditor || "vim";
    }
    return "vim";
}

// Executes the given SQL query and displays the result
async function executeSQLQuery(sqlQuery) {
    const loadingSpinner = ora("Executing SQL query...").start();
    try {
        const dbClient = await pool.connect();
        const queryResult = await dbClient.query(sqlQuery);
        dbClient.release();
        loadingSpinner.succeed(chalk.green("Query executed successfully!"));
        console.table(queryResult.rows);
    } catch (error) {
        loadingSpinner.fail(chalk.red("Query execution failed!"));
        console.error(chalk.red(error.message));
    }
}

// Opens the preferred text editor for query input
async function getQueryFromEditor() {
    return new Promise((resolve, reject) => {
        const tempFilePath = path.join(os.tmpdir(), `pg_query_${Date.now()}.sql`);
        fs.writeFileSync(tempFilePath, "-- Write your SQL query here\n");

        const editor = getPreferredEditor();
        console.log(chalk.cyan(`\nOpening ${editor}...`));

        const editorProcess = spawn(editor, [tempFilePath], { stdio: "inherit" });

        editorProcess.on("exit", () => {
            const sqlQuery = fs.readFileSync(tempFilePath, "utf-8").trim();
            fs.unlinkSync(tempFilePath);
            resolve(sqlQuery);
        });

        editorProcess.on("error", (error) => {
            reject(error);
        });
    });
}

// Allows the user to enter queries directly in the CLI
async function getQueryFromInlineInput() {
    while (true) {
        const sqlQuery = readlineSync.question(chalk.yellow("\nEnter SQL query (or type 'exit' to return to menu): "));
        if (sqlQuery.toLowerCase() === "exit") return null;
        await executeSQLQuery(sqlQuery);
    }
}

// Displays the main menu and handles user selections
async function showMainMenu() {
    while (true) {
        console.log(chalk.blue.bold("\nPostgreSQL CLI Tool - Main Menu\n"));
        const { selectedOption } = await inquirer.prompt([
            {
                type: "list",
                name: "selectedOption",
                message: "Choose an option:",
                choices: ["Run Query (Inline)", "Run Query (Editor)", "Exit"],
            }
        ]);

        if (selectedOption === "Exit") {
            console.log(chalk.green("\nGoodbye!\n"));
            process.exit(0);
        }

        if (selectedOption === "Run Query (Inline)") {
            await getQueryFromInlineInput();
        } else if (selectedOption === "Run Query (Editor)") {
            const sqlQuery = await getQueryFromEditor();
            if (sqlQuery) await executeSQLQuery(sqlQuery);
        }
    }
}

showMainMenu();