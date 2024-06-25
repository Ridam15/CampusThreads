// Experience.jsx
import React from 'react';
import { Icon } from "@iconify/react";

function Experience() {
  return (
    <div className="justify-center ml-80">
      <p className="font-bold text-2xl mt-4">Experience</p>
      <div className="bg-slate-200 w-4/5 h-44 rounded-2xl mt-4 overflow-auto">
        {/* Experience cards go here */}

        <div className="flex">
          <Icon
            icon="basil:adobe-experince-design-outline"
            color="#2563eb"
            className="mt-4 ml-4"
            width="96"
            height="84"
          />
          <div className="flex flex-col">
            <div className="justify-between">
              <p className="text-2xl ml-4 font-medium mt-6">
                Freelance UI/UX Designer
              </p>
            </div>
            <div className="flex mt-1 ml-4 space-x-10 text-lg">
              <p>Self Employed</p>
              <p>Around the world</p>
            </div>
            <div className="flex mt-1 ml-4">
              <p>Jun 2016 - present</p>
              <p className="text-cyan-500 ml-6 text-lg">3 yrs 3 mos</p>
            </div>
            <div className="mt-1 ml-4">
              <p className="w-96">
                I worked as a freelance designer for clients and have good
                experience with web studios.
              </p>
            </div>
          </div>
        </div>
        {/* Add more experience cards as needed */}
        <div className="flex">
          <Icon
            icon="basil:adobe-experince-design-outline"
            color="#2563eb"
            className="mt-4 ml-4"
            width="96"
            height="84"
          />
          <div className="flex flex-col">
            <div className="justify-between">
              <p className="text-2xl ml-4 font-medium mt-6">
                Freelance UI/UX Designer
              </p>
            </div>
            <div className="flex mt-1 ml-4 space-x-10 text-lg">
              <p>Self Employed</p>
              <p>Around the world</p>
            </div>
            <div className="flex mt-1 ml-4">
              <p>Jun 2016 - present</p>
              <p className="text-cyan-500 ml-6 text-lg">3 yrs 3 mos</p>
            </div>
            <div className="mt-1 ml-4">
              <p className="w-96">
                I worked as a freelance designer for clients and have good
                experience with web studios.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>


  );

}

export default Experience;
