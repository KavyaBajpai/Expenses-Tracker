"use client";
import { useState } from "react";
import { X } from "lucide-react";

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResponse(null); // Reset response when a new file is selected
      setError(null); // Reset error
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResponse(null);
    setError(null);
  };

//   const handleUpload = async () => {
//     if (!selectedFile) return;
//     setUploading(true);
//     setError(null);

//     const reader = new FileReader();
//     reader.readAsDataURL(selectedFile);
//     reader.onloadend = async () => {
//       const base64String = reader.result.split(",")[1]; // Extract base64 content

//       try {
//         const res = await fetch("/api/extract", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ imageBase64: base64String }),
//         });

//         if (!res.ok) {
//           throw new Error("Failed to process the receipt.");
//         }

//         const data = await res.json();
//         console.log(data)
//         setResponse(data.items || []);
//       } catch (err) {
//         setError(err.message || "An error occurred.");
//       } finally {
//         setUploading(false);
//       }
//     };
//   };


const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
  
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async () => {
      const base64String = reader.result.split(",")[1];
  
      try {
        const res = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64String }),
        });
  
        if (!res.ok) {
          throw new Error("Failed to process the receipt.");
        }
  
        const rawData = await res.json();
        console.log("Raw data:", rawData);
  
        // Extract and clean the response
        let cleanData = rawData.data.replace(/^```json\n|\n```$/g, ""); // Remove markdown syntax
        console.log("Clean JSON string:", cleanData);
  
        const parsedData = JSON.parse(cleanData);
        console.log("Parsed data:", parsedData);
  
        setResponse(parsedData.items || []);
      } catch (err) {
        setError(err.message || "An error occurred.");
      } finally {
        setUploading(false);
      }
    };
  };
  
  return (
    <div className="text-center p-5 max-w-sm mx-auto border rounded-lg shadow-lg">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block mx-auto my-2"
      />
      {previewUrl && (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full max-h-48 object-cover mt-2 rounded"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
          >
            <X size={16} />
          </button>
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {error && <p className="mt-3 text-red-500">{error}</p>}

      {response && response.length > 0 && (
        <div className="mt-3 text-left bg-gray-100 p-3 rounded">
          <h3 className="font-bold">Extracted Items:</h3>
          <ul className="mt-2">
            {response.map((item, index) => (
              <li key={index} className="text-gray-700">
                <strong>{item.name}</strong> - {item.category} - ₹{item.amount}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
