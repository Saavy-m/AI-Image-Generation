import { useState } from "react";
import ImageGenerator from "./ImageGenerator";
import ListImages from "./ListImages";
import { useNavigate } from "react-router-dom";

const tabs = [
  { name: "Image Generator", key: "generator" },
  { name: "History", key: "history" },
];


function classNames(...classes : any) {
  return classes.filter(Boolean).join(' ')
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("generator");

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id'); 
    navigate('/login')
  }

  return (
    <div className="border-b border-gray-200">
      <div className="bg-white top-0 z-10 fixed flex flex-row justify-between w-full h-16 border-b border-gray-200 items-center px-8">
          <div className="flex flex-row gap-4 items-center">
            <h1 className="text-2xl text-black font-medium">AI</h1>
            <div className="w-[2px] bg-gray-400 h-5"></div>
            <h1 className="lg:text-base text-sm text-black font-semibold">
              AI Image Generator
            </h1>
          </div>

          <div className="flex flex-row gap-3">
            <button onClick={logout} className="text-sm py-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>

            </button>
          </div>
        </div>
    <div className="sm:flex sm:items-baseline mt-20">
      <div className="mt-4 ml-4 sm:ml-10 sm:mt-0">
        <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={classNames(
                    activeTab === tab.key
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                    "whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium"
                  )}
                >
                  {tab.name}
                </button>
              ))}
        </nav>
      </div>
    </div>
    <div className="px-4">
        {activeTab === "generator" && <ImageGenerator />}
        {activeTab === "history" && <ListImages />}
      </div>
  </div>
  );
};

export default Dashboard;
