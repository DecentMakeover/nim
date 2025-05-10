import { NextResponse } from 'next/server';
import fs from 'fs/promises'; // Using promises version of fs
import path from 'path';

const tattoosDirectory = path.join(process.cwd(), 'public', 'generated_tattoos');

export async function GET() {
  try {
    // Ensure the directory exists, if not, return empty list
    try {
      await fs.access(tattoosDirectory);
    } catch (e) {
      // Directory does not exist, so no images to list
      return NextResponse.json({ images: [] });
    }

    const filenames = await fs.readdir(tattoosDirectory);

    const imageFiles = filenames
      .filter(filename => /\.(png|jpe?g|gif|webp)$/i.test(filename)) // Filter for common image extensions
      .map(filename => `/generated_tattoos/${filename}`); // Create public paths
    
    // Optional: Sort images, e.g., by newest first if filenames allow (like timestamps)
    // For simplicity, we'll return them as readdir finds them, or you can sort by name:
    imageFiles.sort().reverse(); // Example: sort by name, newest first if timestamps are in names

    return NextResponse.json({ images: imageFiles });

  } catch (error) {
    console.error('Error reading tattoos directory:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to retrieve tattoo images.', details: errorMessage }, { status: 500 });
  }
} 