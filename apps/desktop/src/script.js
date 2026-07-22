import os from 'node:os';
import path from 'node:path';
import { PythonShell } from 'python-shell';

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

    const defaultOptions = {
        mode: 'text',
        pythonPath: process.env.PYTHON_PATH || 'python3' || 'python',
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
        throw new Error(`[Python Script Error in ${scriptName}]: ${err.message}`);
    }
}

export { invokeScript };