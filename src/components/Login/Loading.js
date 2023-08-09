import React, { useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";

const Loading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => prevProgress + 10);
    }, 100);

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <img
        src="https://infolks.info/images/logo/logo-rc.svg"
        className="w-full"
        alt="logo"
        style={{ height: "150px" }}
      ></img>

      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: "9999",
        }}
        className="flex flex-col items-center justify-end"
      >
        <p className="text-2xl font-bold text-blue-800 ">INFOMEETS</p>
        <LoadingBar progress={progress} height={3} color="#263997" />
      </div>
    </div>
  );
};

export default Loading;
