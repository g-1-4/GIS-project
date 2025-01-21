import React from 'react';

function Home() {
  return (
    <>
      <div
        className="w-screen h-screen bg-cover bg-center relative "
        style={{
          backgroundImage: "url('/images/IndiaPic.jpg')",
        }}
      >

        <div className="absolute inset-y-24 right-12 h-60 w-72 bg-gradient-to-b from-blue-500/70 via-blue-700/50 to-blue-900/30 text-white p-4">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Qui et aliquam omnis doloremque blanditiis minima magnam accusamus placeat, optio ab dolorum amet quam ex numquam error consequatur mollitia architecto obcaecati.
        </div>
      </div>
    </>
  );
}

export default Home;
