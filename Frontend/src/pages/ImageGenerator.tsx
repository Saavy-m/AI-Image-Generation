import React from 'react'
import { useState } from 'react'



const ImageGenerator : React.FC = () => {

  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false); 

  const generateImage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setImage(null);
    const user_id = localStorage.getItem("user_id");
    const formData = { prompt, user_id: user_id };

    try {
      const response = await fetch("https://ai-image-generation-pi2a.onrender.com/api/image/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("Response :", response);

      if (response.ok) {
        const data = await response.json();
        setImage(data.image_url); // S3 URL
      } else {
        console.error("Error generating image:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }finally {
      setIsLoading(false); 
    }
  };
  
  const downloadImage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!image) return;
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "generated_image.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-4 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        <div className="lg:max-w-lg lg:self-end">
          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">AI Image Generator</h1>
          </div>

          <section aria-labelledby="information-heading" className="mt-4">
            <h2 id="information-heading" className="sr-only">
              Product information
            </h2>

            <div className="flex items-center">
              <p className="text-md text-gray-900 sm:text-lg">Give a Prompt to generate an image</p>
            </div>

            <div className="mt-4 space-y-6">
            <div className="w-full">
            <textarea
                id="message"
                rows={5}
                className="w-full min-h-32 resize-none p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm md:text-base lg:text-lg"
                placeholder="Type your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            ></textarea>
            {/* {error && <p className="text-red-500 text-sm mt-1">{error}</p>} */}
            </div>
            </div>

            <div className="mt-6 flex items-center">
              <p className="ml-2 text-sm text-gray-500">Try to be as specific as possible</p>
            </div>
          </section>
        </div>

        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          {isLoading ? (
            <div className="w-full h-[70%] aspect-square flex items-center justify-center rounded-lg bg-gray-200">
              <svg className="animate-spin h-10 w-10 text-gray-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            </div>
          ) : image ? (
            <img src={image} alt="Generated" className="w-full rounded-lg object-cover aspect-square" />
          ) : (
            <div className="w-full h-[70%] aspect-square bg-gray-200 flex items-center justify-center rounded-lg">
              <p className="text-gray-500">No image generated yet</p>
            </div>
          )}
        </div>

        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section aria-labelledby="options-heading">
            <h2 id="options-heading" className="sr-only">
              Product options
            </h2>

            <form>
              <div className="mt-10 flex flex-row justify-between items-center gap-x-6">
                <button
                  type="button"
                  onClick={generateImage}
                  className="cursor-pointer flex w-[60%] items-center justify-center rounded-md border border-transparent bg-black px-8 py-3 text-base font-medium text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                 Generate Image
                </button>
                {image && (
                <button
                  onClick={downloadImage}
                  className="cursor-pointer flex w-[40%] items-center justify-center rounded-md bg-black px-8 py-3 text-white font-medium hover:bg-black focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Download
                </button>
              )}
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ImageGenerator
