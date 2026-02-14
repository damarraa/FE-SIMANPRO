import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, RefreshCw, X, Check } from "lucide-react";

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user",
};

const WebcamCapture = ({ onCapture, onClose }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const handleUserMedia = () => {
    console.log("Webcam aktif!");
    setIsCameraReady(true);
  };

  const capture = useCallback(() => {
    console.log("Tombol capture diklik!");

    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImage(imageSrc);
      } else {
        console.error("Gagal mengambil screenshot (null)");
      }
    }
  }, [webcamRef]);

  const retake = () => {
    setImage(null);
  };

  const confirm = () => {
    if (image) onCapture(image);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90 p-4">
      <div className="bg-white p-4 rounded-xl shadow-2xl w-full max-w-md relative flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="font-bold text-lg text-gray-800">Ambil Foto</h3>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="relative rounded-lg overflow-hidden bg-black aspect-square w-full">
          {image ? (
            <img
              src={image}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              {!isCameraReady && (
                <div className="absolute inset-0 flex items-center justify-center text-white z-10">
                  Loading Kamera...
                </div>
              )}
              <Webcam
                audio={false}
                height={720}
                width={720}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full h-full object-cover"
                onUserMedia={handleUserMedia}
                mirrored={true}
              />
            </>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-6 relative z-50">
          {image ? (
            <>
              <button
                onClick={retake}
                className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <RefreshCw size={20} /> Ulangi
              </button>
              <button
                onClick={confirm}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Check size={20} /> Gunakan
              </button>
            </>
          ) : (
            <button
              onClick={capture}
              disabled={!isCameraReady}
              className={`p-4 rounded-full shadow-xl flex items-center justify-center transition-all
                    ${
                      isCameraReady
                        ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer active:scale-95"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }
                `}
            >
              <Camera size={32} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebcamCapture;
