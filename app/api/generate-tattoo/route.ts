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
    // Try python3 first (conventional name), but fall back to python if needed
    const pythonExecutable = 'python3';
    const fallbackPythonExecutable = 'python';
    
    const scriptEnv = { 
      ...process.env, 
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY 
    };

    return new Promise<NextResponse>((resolve) => {
      // Try with the primary python executable first
      let pythonProcess = spawn(pythonExecutable, [scriptPath, prompt], { env: scriptEnv });
      
      // Listen for error in case python3 is not found
      pythonProcess.on('error', (err) => {
        // If the error is ENOENT (executable not found), try the fallback python executable
        // Use type assertion for NodeJS error which may contain a 'code' property
        if ((err as { code?: string }).code === 'ENOENT') {
          console.log(`${pythonExecutable} not found, trying ${fallbackPythonExecutable} instead...`);
          
          // Attempt with the fallback python executable
          pythonProcess = spawn(fallbackPythonExecutable, [scriptPath, prompt], { env: scriptEnv });
          
          let outputData = '';
          let errorData = '';
          
          pythonProcess.stdout.on('data', (data) => {
            outputData += data.toString();
          });
          
          pythonProcess.stderr.on('data', (data) => {
            errorData += data.toString();
            console.error(`Python stderr: ${data}`);
          });
          
          pythonProcess.on('close', handleClose);
          
          pythonProcess.on('error', (fallbackErr) => {
            console.error(`Failed to start ${fallbackPythonExecutable} process:`, fallbackErr);
            resolve(NextResponse.json({ 
              error: `Failed to start Python process with both ${pythonExecutable} and ${fallbackPythonExecutable}.`, 
              details: fallbackErr.message 
            }, { status: 500 }));
          });
        } else {
          // If it's some other error, report it
          console.error(`Failed to start ${pythonExecutable} process:`, err);
          resolve(NextResponse.json({ 
            error: `Failed to start Python process: ${err.message}`, 
            details: err.message 
          }, { status: 500 }));
        }
        return; // Important to prevent further handling
      });
      
      let outputData = '';
      let errorData = '';
      
      pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
        console.error(`Python stderr: ${data}`);
      });
      
      const handleClose = (code: number) => {
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
      };
      
      pythonProcess.on('close', handleClose);
    });

  } catch (error) {
    console.error('Error in API route handler:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred processing your request.';
    return NextResponse.json({ error: 'Internal server error.', details: errorMessage }, { status: 500 });
  }
} 