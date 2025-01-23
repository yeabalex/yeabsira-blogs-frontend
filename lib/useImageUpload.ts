import { useState } from 'react';

export interface ImageUploadResult {
    imageUrl: string;
}

export const useImageUpload = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const result: ImageUploadResult = await response.json();
      setImageUrl(result.imageUrl);
      return result.imageUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  return { uploadImage, imageUrl };
};