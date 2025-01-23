export const uploadImage = async (file: Blob) => {
    // Simulating image upload
    return URL.createObjectURL(file);
  };