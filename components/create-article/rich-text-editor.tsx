import React, { useState, useRef } from 'react';
import { Bold, Heading1, Heading2, Image as ImageIcon, X} from 'lucide-react';
import { ApiClient } from '@/lib/api-client';
import { webBaseURL } from '@/constants/url';
import { getCookie } from '@/lib/getCookie';

interface RichTextEditorProps {
  onContentChange: (content: string) => void;
  onImageUpload?: (images: string[]) => void;
  onExportHtml?: (html: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  onContentChange,
  onImageUpload,
}) => {

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [activeStyles, setActiveStyles] = useState<{
    bold: boolean;
    heading1: boolean;
    heading2: boolean;
  }>({
    bold: false,
    heading1: false,
    heading2: false,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Toggle and apply formatting styles
  const handleStyleApply = (command: string, styleKey: keyof typeof activeStyles) => {
    document.execCommand(command, false, '');
    setActiveStyles((prevStyles) => ({
      ...prevStyles,
      [styleKey]: !prevStyles[styleKey],
    }));
  };

  // Handle image uploads
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const user = getCookie('user');
    console.log(user)
    if (file && user) {
      const apiClient = new ApiClient(webBaseURL);
      const imageUrl:{data:{publicUrl:string}} = await apiClient.uploadFile("/image/upload/blog",file)
      const imgElement = document.createElement('img');
      imgElement.src = imageUrl.data.publicUrl;
      imgElement.alt = 'Uploaded Image';
      imgElement.style.maxWidth = '100%';
      imgElement.style.margin = '10px 0';

      const placeholder = document.createElement('div');
      placeholder.innerHTML = '<br>';

      editorRef.current?.appendChild(imgElement);
      editorRef.current?.appendChild(placeholder);

      const newUploadedImages = [...uploadedImages, imageUrl.data.publicUrl];
      setUploadedImages(newUploadedImages);
      if (onImageUpload) onImageUpload(newUploadedImages);

      const updatedContent = editorRef.current?.innerHTML || '';
      onContentChange(updatedContent);
    }
  };


  

  // Track content changes in the editor
  const handleContentChange = () => {
    const htmlContent = editorRef.current?.innerHTML || '';
    onContentChange(htmlContent);
  };

  // Remove an uploaded image
  const removeImage = (imageToRemove: string) => {
    const updatedImages = uploadedImages.filter((image) => image !== imageToRemove);
    setUploadedImages(updatedImages);

    const editor = editorRef.current;
    if (editor) {
      const imgElements = Array.from(editor.querySelectorAll('img'));
      imgElements.forEach((img) => {
        if (img.src === imageToRemove) {
          img.remove();
        }
      });
    }

    const updatedContent = editorRef.current?.innerHTML || '';
    onContentChange(updatedContent);
  };

  // Export content as HTML


  return (
    <div className="rich-text-editor bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
      {/* Toolbar */}
      <div className="toolbar flex items-center p-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 space-x-2">
        <button
          onClick={() => handleStyleApply('bold', 'bold')}
          className={`hover:bg-spotify-green hover:bg-opacity-20 p-2 rounded ${
            activeStyles.bold ? 'bg-spotify-green text-white' : ''
          }`}
          title="Bold"
        >
          <Bold size={20} className={activeStyles.bold ? 'text-white' : 'text-spotify-green'} />
        </button>
        <button
          onClick={() => handleStyleApply('formatBlock', 'heading1')}
          className={`hover:bg-spotify-green hover:bg-opacity-20 p-2 rounded ${
            activeStyles.heading1 ? 'bg-spotify-green text-white' : ''
          }`}
          title="Heading 1"
        >
          <Heading1 size={20} className={activeStyles.heading1 ? 'text-white' : 'text-spotify-green'} />
        </button>
        <button
          onClick={() => handleStyleApply('formatBlock', 'heading2')}
          className={`hover:bg-spotify-green hover:bg-opacity-20 p-2 rounded ${
            activeStyles.heading2 ? 'bg-spotify-green text-white' : ''
          }`}
          title="Heading 2"
        >
          <Heading2 size={20} className={activeStyles.heading2 ? 'text-white' : 'text-spotify-green'} />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="hover:bg-spotify-green hover:bg-opacity-20 p-2 rounded"
          title="Upload Image"
        >
          <ImageIcon size={20} className="text-spotify-green" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
      </div>
      {/* Editable Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        className="w-full h-64 p-4 bg-white dark:bg-black text-black dark:text-white rounded-b-lg focus:outline-none focus:ring-2 focus:ring-spotify-green"
        style={{ whiteSpace: 'pre-wrap', overflowY: 'auto' }}
      />
      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-spotify-green font-semibold mb-2">Uploaded Images</h3>
          <div className="flex flex-wrap gap-4">
            {uploadedImages.map((imageUrl) => (
              <div key={imageUrl} className="relative">
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(imageUrl)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
