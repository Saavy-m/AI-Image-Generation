import React , { useState , useEffect} from 'react'

interface Image {
    id: number;
    image_url: string; 
    created_at: string;
    prompt : string;

  }

const ListImages : React.FC = () => {

    const [images , setImages] = useState<Image[]>([])
    const [loading, setLoading] = useState<boolean>(false);

  
    const getAllImageData = async () => {
        try {
            setLoading(true); 
          const user_id = localStorage.getItem("user_id");
          if (!user_id) {
            console.error("No user_id found in localStorage");
            setLoading(false); 
            return;
          }
    
          const response = await fetch(`https://ai-image-generation-pi2a.onrender.com/api/image/images/${parseInt(user_id)}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const data = await response.json();
          console.log("Data in getAllImages:", data);
          return data;

        } catch (error) {
          console.error("Error fetching images:", error);
        } finally {
            setLoading(false); 
          }
      };

      const deleteImageById = async (image_id : any) => {
        try {
          
          const response = await fetch(`https://ai-image-generation-pi2a.onrender.com/api/image/image_delete/${parseInt(image_id)}` ,
          {
            headers: { "Content-Type": "application/json" },
            method:"DELETE"
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          setImages((prevImages) => prevImages.filter((img) => img.id !== image_id));

        } catch (error) {
          console.error("Error deleting images:", error);
        }
      };

    useEffect(() => {
        getAllImageData().then((data) => {
            setImages(data);
        })
    }, [])

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-8 lg:px-0">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Generated Image History</h1>

        <form className="mt-12">
          <section aria-labelledby="cart-heading">
            <h2 id="cart-heading" className="sr-only">
              Previous searched images
            </h2>

            <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
              {images?.map((image : any) => (
                <li key={image.id} className="flex py-6">
                  <div className="shrink-0">
                    <img
                      alt={"Image AWS"}
                      src={image.image_url}
                      className="size-24 rounded-md object-cover sm:size-32"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                      <div className="flex flex-col justify-start items-start w-52 md:w-full">
                        <h4 className="text-sm">
                          <a href={image.image_url} target='blank' className="ml-4 mb-4 font-medium text-md text-gray-700 hover:text-gray-800">
                            {image.prompt}
                          </a>
                        </h4>
                        <p className="ml-4 mt-4 md:w-max w-[70%] overflow-hidden text-xs underline font-medium text-gray-900">Image URL : {image.image_url}</p>
                      </div>
                      <p className="mt-1 ml-4 text-xs text-gray-500">Created On : {image.created_at}</p>

                    <div className="mt-4 flex flex-1 items-end justify-between">
                      <div className="ml-4">
                        <button type="button" onClick={() => {deleteImageById(image.id)}} className="cursor-pointer flex flex-row justify-evenly items-center gap-x-2 text-sm border border-gray-300 hover:border-red-500 px-3 py-2 rounded-lg font-medium text-black hover:text-red-500">
                          <span>Delete</span>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z" fill="#686C77"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          {loading ? (
            <section aria-labelledby="loading-heading" className="mt-10 text-center">
              <div className="w-full rounded-md border border-transparent bg-gray-800 px-4 py-3 text-base font-medium text-white shadow-sm">
                Loading images...
              </div>
            </section>
          ) : images.length === 0 ? (
            <section aria-labelledby="summary-heading" className="mt-10">
              <div className="mt-10">
                <div className="w-full rounded-md border border-transparent text-center bg-gray-800 px-4 py-3 text-base font-medium text-white shadow-sm">
                  No Images
                </div>
              </div>

              <div className="mt-6 text-center text-sm">
                <p>
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    You can see the history of your generated Images here
                    <span aria-hidden="true"> &rarr;</span>
                  </a>
                </p>
              </div>
            </section>
          ) : null}
        </form>
      </div>
    </div>
  )
}

export default ListImages
