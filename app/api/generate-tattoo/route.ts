import { NextResponse, NextRequest } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const scriptPath = path.join(process.cwd(), 'app', 'create_tattoo.py');
    // IMPORTANT for Vercel: Use generic python3. The local venv path will not work on Vercel.
    const pythonExecutable = 'python';

    const scriptEnv = { 
      ...process.env, 
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY 
    };

    return new Promise<NextResponse>((resolve) => {
      const pythonProcess = spawn(pythonExecutable, [scriptPath, prompt], { env: scriptEnv });

      let outputData = '';
      let errorData = '';

      pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
        console.error(`Python stderr: ${data}`);
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python script exited with code ${code}. Error: ${errorData}`);
          resolve(NextResponse.json({ error: 'Failed to generate tattoo from script.', details: errorData }, { status: 500 }));
          return;
        }

        const lines = outputData.split(/\r?\n/);
        let imageBase64 = null;
        let imagePath = null;

        for (const line of lines) {
          if (line.startsWith('IMAGE_BASE64:')) {
            imageBase64 = line.substring('IMAGE_BASE64:'.length);
          } else if (line.startsWith('IMAGE_PATH:')) {
            imagePath = line.substring('IMAGE_PATH:'.length);
          }
          if (imageBase64 && imagePath) {
            break;
          }
        }

        if (imageBase64) {
          resolve(NextResponse.json({ image: imageBase64, imagePath: imagePath }));
        } else {
          console.error('No IMAGE_BASE64 found in Python script output. Full output:', outputData);
          resolve(NextResponse.json({ error: 'Failed to retrieve image from script output.', details: outputData }, { status: 500 }));
        }
      });

      pythonProcess.on('error', (err) => {
        console.error('Failed to start Python process:', err);
        resolve(NextResponse.json({ error: 'Failed to start Python process.', details: err.message }, { status: 500 }));
      });
    });

  } catch (error) {
    console.error('Error in API route handler:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred processing your request.';
    return NextResponse.json({ error: 'Internal server error.', details: errorMessage }, { status: 500 });
  }
} 