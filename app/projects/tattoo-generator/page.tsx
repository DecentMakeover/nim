'use client';

import { useState, useEffect } from 'react';

export default function TattooGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTattoos = async () => {
      try {
        const response = await fetch('/api/get-all-tattoos');
        if (!response.ok) {
          throw new Error('Failed to fetch gallery images.');
        }
        const data = await response.json();
        setGalleryImages(data.images || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        console.error('Error fetching gallery tattoos:', errorMessage);
      }
    };
    fetchTattoos();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a tattoo description.');
      return;
    }

    setIsLoading(true);
    setImageUrl('');
    setError('');

    try {
      const response = await fetch('/api/generate-tattoo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to generate tattoo');
      }

      if (data.image) {
        setImageUrl(`data:image/png;base64,${data.image}`);
        if (data.imagePath) {
          setGalleryImages(prevImages => [data.imagePath, ...prevImages]);
        }
      } else {
        throw new Error('No image data received from server.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error('Error generating tattoo:', errorMessage);
      setError(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'tattoo-design.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Tattoo Design Generator</h1>
      
      <div style={{ maxWidth: '600px', margin: '0 auto 40px auto' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the tattoo you want to create... (e.g., 'a majestic dragon coiling around a cherry blossom branch, Japanese style')"
            rows={4}
            style={{
              padding: '10px',
              fontSize: '16px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              resize: 'vertical'
            }}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading} 
            style={{
              padding: '10px 15px',
              fontSize: '16px',
              color: 'white',
              backgroundColor: isLoading ? '#ccc' : '#007bff',
              border: 'none',
              borderRadius: '5px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {isLoading ? 'Generating...' : 'Generate Tattoo'}
          </button>
        </form>

        {error && (
          <p style={{ color: 'red', marginTop: '20px', textAlign: 'center' }}>{error}</p>
        )}

        {isLoading && (
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <p>Generating your tattoo... please wait.</p>
          </div>
        )}

        {imageUrl && !error && (
          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '15px' }}>Your Generated Tattoo:</h2>
            <img 
              src={imageUrl} 
              alt="Generated Tattoo" 
              style={{ maxWidth: '100%', border: '1px solid #eee', borderRadius: '5px' }} 
            />
            <button 
              onClick={handleDownload} 
              style={{
                marginTop: '20px',
                padding: '10px 15px',
                fontSize: '16px',
                color: 'white',
                backgroundColor: '#28a745',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Download Image
            </button>
          </div>
        )}
      </div>

      {galleryImages.length > 0 && (
        <div style={{ marginTop: '50px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Wall of Generated Tattoos</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            {galleryImages.map((path, index) => (
              <div key={index} style={{ border: '1px solid #ddd', borderRadius: '5px', overflow: 'hidden' }}>
                <img 
                  src={path} 
                  alt={`Generated tattoo ${index + 1}`} 
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 