// Projects.jsx
import React from 'react';

function Projects() {
  return (


    <div>
      <div className="ml-80 mt-3">
        <p className="font-bold text-2xl mt-3">Projects</p>
      </div>
      <div className="flex space-x-14 ml-80 min-w-[200px] ">
        {/* Project cards go here */}
        <div className="mt-4 bg-slate-200  w-72 h-32">
          <img src={"./src/assets/Zara.png"} alt="Project" />
          <p className="font-medium text-lg mt-1 ml-2">
            Zara Redesign Concept
          </p>
          <p className="ml-2 font-light">UI/UX Design, 15/07/2019</p>
        </div>
        {/* Add more project cards as needed */}
      </div>
      <div className="flex mt-16 ml-80">
        <p className="text-blue-800 text-2xl">More Projects..(12)</p>
      </div>
    </div>


  );
}

export default Projects;
