import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { PythonShell } from 'python-shell';

const execFileAsync = promisify(execFile);

let cachedPythonPath = null;

/**
 * Detects a working Python interpreter on the system
 * Tries PTHON_PATH env var, py, python, then python3
 * @returns {Promise<string>} The command to use for Python
 */
async function detectPythonCommand() {
    if (cachedPythonPath) return cachedPythonPath;

    const commands = [
        process.env.PYTHON_PATH,
        'py',
        'python',
        'python3'
    ].filter(Boolean);

    for (const cmd of commands) {
        try {
            await execFileAsync(cmd, ['--version']);
            cachedPythonPath = cmd;
            return cmd;
        } catch (err) {
            continue;
        }
    }

    throw new Error('No working Python interpreter found. Please install Python and ensure it is in your PATH.');
}

/**
 * Executes a Python script asynchronously and returns its output.
 * 
 * @param {string} scriptPath - Absolute or relative path to the .py file.
 * @param {Array<string>} args - Arguments to pass to sys.argv.
 * @param {Object} [options={}] - Optional configuration overrides.
 * @returns {Promise<any>} The raw text output.
 */
async function invokeScript(scriptPath, args = [], options = {}) {
    // Resolve directory and filename automatically
    const absolutePath = path.resolve(scriptPath);
    const scriptFolder = path.dirname(absolutePath);
    const scriptName = path.basename(absolutePath);
    const pythonPath = await detectPythonCommand();

    const defaultOptions = {
        mode: 'text',
        pythonPath,
        scriptPath: scriptFolder,
        args: args,
        pythonOptions: ['-u'], // Unbuffered output so logs print immediately
        ...options
    };

    try {
        const results = await PythonShell.run(scriptName, defaultOptions);
        if (!results || results.length === 0) {
            return null;
        }
        return results.join(os.EOL);
    } catch (err) {
        console.error('Full Python error object:', err);
        const detail = err.stderr || err.message
        throw new Error(`[Python Script Error in ${scriptName}]: ${detail}`);
    }
}

/**
 * Executes a Python script asynchronously and keeps it running until the process is terminated.
 * @param {string} scriptPath - Absolute or relative path to the .py file. 
 * @param {Array<String>} args - Arguments to pass to sys.argv. 
 * @param {Object} options - Optional configuration overrides.
 * @returns {PythonShell} The PythonShell instance for the running script.
 */
async function startScript(scriptPath, args = [], options = {}) {
    const absolutePath = path.resolve(scriptPath);
    const scriptName = path.basename(absolutePath);
    const scriptFolder = path.dirname(absolutePath);
    const pythonPath = await detectPythonCommand();  
    
    const shell = new PythonShell(scriptName, {
        mode: 'text',
        pythonPath,
        scriptPath: scriptFolder,
        args: args,
        pythonOptions: ['-u'], // Unbuffered output
        ...options
    });

    shell.on('message', (line) => console.log(`[${scriptName}]`, line));
    shell.on('stderr', (line) => console.error(`[${scriptName}]`, line));
    // Without an 'error' listener, a non-zero exit throws an uncaught exception
    shell.on('error', (err) => console.error(`[${scriptName}] exited with error:`, err));

    return shell;
}

export { invokeScript, startScript };