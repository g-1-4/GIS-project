import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <div className="w-screen h-screen relative flex items-end p-4">
        <div className="h-40 w-full bg-gradient-to-b from-blue-500/70 via-blue-700/50 to-blue-900/30 text-white p-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. 
          Sed vero, laborum minus similique, explicabo eum inventore culpa voluptate.
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
