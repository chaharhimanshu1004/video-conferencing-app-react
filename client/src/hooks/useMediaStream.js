import { useEffect, useState } from "react";

const useMediaStream = () => {
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const initStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setStream(mediaStream);
      } catch (error) {
        console.error("Error in media Navigator", error);
      }
    };

    initStream();
  }, []);

  return {
    stream,
  };
};

export default useMediaStream;
