import { useState } from "react";
import ImageGenerator from "./ImageGenerator";
import ListImages from "./ListImages";

const tabs = [
  { name: "Image Generator", key: "generator" },
  { name: "History", key: "history" },
];


function classNames(...classes : any) {
  return classes.filter(Boolean).join(' ')
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("generator");

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
            <button className="text-sm px-7 py-2 rounded-lg border">
              Logout
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
