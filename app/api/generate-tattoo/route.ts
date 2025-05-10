import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Path to the Python script, assuming it's in 'app/create_tattoo.py' relative to the project root.
    const scriptPath = path.join(process.cwd(), 'app', 'create_tattoo.py');
    // Path to the Python executable in the virtual environment.
    const pythonExecutable = path.join(process.cwd(), 'venv', 'bin', 'python3');

    // --- New code to pass environment variables to Python script ---
    const scriptEnv = { 
      ...process.env, // Inherit current environment variables
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY 
    };
    // --- End of new code ---

    return new Promise((resolve) => {
      // Ensure the executable path is correct and script exists
      // console.log(`Executing: ${pythonExecutable} ${scriptPath} "${prompt}"`); // For debugging

      const pythonProcess = spawn(pythonExecutable, [scriptPath, prompt], { env: scriptEnv });

      let outputData = '';
      let errorData = '';

      pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
        console.error(`Python stderr: ${data}`); // Log errors for debugging during development
      });

      pythonProcess.on('close', (code) => {
        // console.log(`Python script outputData: ${outputData}`); // For debugging
        // console.log(`Python script errorData: ${errorData}`); // For debugging
        // console.log(`Python script exit code: ${code}`); // For debugging

        if (code !== 0) {
          console.error(`Python script exited with code ${code}. Error: ${errorData}`);
          return resolve(NextResponse.json({ error: 'Failed to generate tattoo from script.', details: errorData }, { status: 500 }));
        }

        const lines = outputData.split(/\r?\n/); // Split by newline, handling both \n and \r\n
        let imageBase64 = null;
        let imagePath = null; // New variable to store image path

        for (const line of lines) {
          if (line.startsWith('IMAGE_BASE64:')) {
            imageBase64 = line.substring('IMAGE_BASE64:'.length);
          } else if (line.startsWith('IMAGE_PATH:')) { // Check for image path
            imagePath = line.substring('IMAGE_PATH:'.length);
          }
          // If both are found, no need to check further lines
          if (imageBase64 && imagePath) {
            break;
          }
        }

        if (imageBase64) {
          // Return both base64 and path if path is also found
          return resolve(NextResponse.json({ image: imageBase64, imagePath: imagePath }));
        } else {
          console.error('No IMAGE_BASE64 found in Python script output. Full output:', outputData);
          return resolve(NextResponse.json({ error: 'Failed to retrieve image from script output.', details: outputData }, { status: 500 }));
        }
      });

      pythonProcess.on('error', (err) => {
        console.error('Failed to start Python process:', err);
        return resolve(NextResponse.json({ error: 'Failed to start Python process.', details: err.message }, { status: 500 }));
      });
    });

  } catch (error) {
    console.error('Error in API route handler:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred processing your request.';
    return NextResponse.json({ error: 'Internal server error.', details: errorMessage }, { status: 500 });
  }
} 