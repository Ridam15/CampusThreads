import { useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import JoinCommunitiesTab from "../CommunityComponents/communities/JoinCommunitiesTab";
import YourCommunitiesTab from "../CommunityComponents/communities/YourCommunitiesTab";
import Header from "../ProfileComponents/Header";

export default function Communities() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div>
      <Header />
      <div className="w-[80%] h-auto min-h-[500px] mt-14 mb-6 mx-auto px-4 py-8 bg-white shadow-lg">
        <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
          <TabList className="flex flex-row items-center justify-between border mt-0 mb-8 mx-auto rounded-2xl border-solid border-[#39A2DB]">
            <Tab className={`py-3 px-6 cursor-pointer transition duration-300 ease-in-out text-center flex-1 rounded-l-2xl ${tabIndex === 0 ? "bg-[#39A2DB] text-white" : "hover:bg-[#32e0c426]"}`}>Your Communities</Tab>
            <Tab className={`py-3 px-6 cursor-pointer transition duration-300 ease-in-out text-center flex-1 rounded-r-2xl ${tabIndex === 1 ? "bg-[#39A2DB] text-white" : "hover:bg-[#32e0c426]"}`}>Join Communities</Tab>
          </TabList>

          <TabPanel>
            <YourCommunitiesTab />
          </TabPanel>
          <TabPanel>
            <JoinCommunitiesTab />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
