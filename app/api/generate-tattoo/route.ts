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
    
    // Try multiple possible Python paths, including Vercel's potential locations
    const pythonPaths = [
      'python3',                             // Standard name
      'python',                              // Alternative standard name
      '/var/lang/bin/python',                // Common in some serverless environments
      '/var/task/python/bin/python',         // Possible Vercel location
      '/opt/python/latest/bin/python'        // Another possible location
    ];
    
    const scriptEnv = { 
      ...process.env, 
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY 
    };

    // This function tries each Python path in sequence
    async function tryPythonPaths(index: number): Promise<NextResponse> {
      if (index >= pythonPaths.length) {
        return NextResponse.json({
          error: `Failed to find any working Python installation. Tried: ${pythonPaths.join(', ')}`,
        }, { status: 500 });
      }

      const currentPath = pythonPaths[index];
      console.log(`Attempting to use Python at: ${currentPath}`);
      
      return new Promise<NextResponse>((resolve, reject) => {
        const pythonProcess = spawn(currentPath, [scriptPath, prompt], { env: scriptEnv });
        
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
            resolve(tryPythonPaths(index + 1)); // Try next path
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
          console.error(`Failed to start Python process with ${currentPath}:`, err);
          resolve(tryPythonPaths(index + 1)); // Try next path
        });
      });
    }

    return tryPythonPaths(0); // Start trying paths from the beginning

  } catch (error) {
    console.error('Error in API route handler:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred processing your request.';
    return NextResponse.json({ error: 'Internal server error.', details: errorMessage }, { status: 500 });
  }
} 