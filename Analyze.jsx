import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as tmImage from "@teachablemachine/image";
import {
  Upload,
  Image as ImageIcon,
  Info,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  TriangleAlert,
} from "lucide-react";
import HowItWorks from "./HowItWorks";
import axios from "axios"; // Add this import
import toast, { Toaster } from "react-hot-toast"; // Add this import

const lesionData = {
  "Actinic Keratoses": {
    description: "A rough, scaly patch on the skin caused by sun exposure.",
    symptoms: "Dry, scaly, or rough patches on the skin; may be red or brown.",
    actions: "Consult a dermatologist for evaluation.",
    treatment: "Cryotherapy, topical medications, or laser therapy.",
    prevention: "Use sunscreen and avoid excessive sun exposure.",
    link: "https://www.mayoclinic.org/diseases-conditions/actinic-keratosis/symptoms-causes/syc-20354969",
  },
  "Benign Keratosis": {
    description:
      "A non-cancerous skin growth that appears as a brown, black, or tan spot.",
    symptoms: "Raised, waxy, or wart-like growths.",
    actions: "Monitor for any changes; consult a doctor if needed.",
    treatment:
      "No treatment required unless bothersome, removal via cryotherapy or laser.",
    prevention: "Regular skin checks and proper hygiene.",
    link: "https://www.mayoclinic.org/diseases-conditions/seborrheic-keratosis/symptoms-causes/syc-20353878",
  },
  Melanoma: {
    description:
      "A serious form of skin cancer that develops in the cells that produce melanin.",
    symptoms:
      "Unusual moles, changes in size, shape, or color of existing moles.",
    actions: "Immediate medical consultation is necessary.",
    treatment: "Surgery, chemotherapy, radiation, or targeted therapy.",
    prevention:
      "Use sunscreen, avoid tanning beds, and perform regular skin checks.",
    link: "https://www.mayoclinic.org/diseases-conditions/melanoma/symptoms-causes/syc-20374884",
  },
  "Melanocytic Nevi": {
    description:
      "Commonly known as moles, these are usually benign but should be monitored.",
    symptoms: "Dark brown to black spots, flat or raised.",
    actions:
      "Monitor for changes; consult a doctor if it changes in size or color.",
    treatment: "No treatment unless suspicious; surgical removal if needed.",
    prevention: "Regular skin checks and sun protection.",
    link: "https://www.ncbi.nlm.nih.gov/books/NBK470451/",
  },
  "Basal Cell Carcinoma": {
    description: "A type of skin cancer that begins in the basal cells.",
    symptoms:
      "Pearly or waxy bumps, flat scaly patches, or sores that don’t heal.",
    actions: "Consult a dermatologist for a biopsy.",
    treatment: "Surgical excision, radiation, or topical treatments.",
    prevention: "Avoid prolonged sun exposure, use sunscreen.",
    link: "https://www.mayoclinic.org/diseases-conditions/basal-cell-carcinoma/symptoms-causes/syc-20354187",
  },
};

function AnalyzeUpload() {
  const [prediction, setPrediction] = useState("Loading model...");
  const [selectedImage, setSelectedImage] = useState(null);
  const [lesionDetected, setLesionDetected] = useState(false);
  const modelRef = useRef(null);
  const maxPredictionsRef = useRef(0);
  const canvasRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const fileInputRef = useRef(null); 

  const doctorInfo = {
    
    name: "Dr. Anandi Gopal Joshi",
    qualification: "MD, Dermatology (15+ years experience)",
    location: "Apollo Hospital, Mumbai",
    phone: "+91 12345 67890",
    email: "dr.anandi@apollo.com",
  };

  const URL = "https://teachablemachine.withgoogle.com/models/kicbPsB4A/";

  const labelMapping = {
    akiec_Actinic_keratoses: "Actinic Keratoses",
    bkl_Benign_keratosis: "Benign Keratosis",
    mel_Melanoma: "Melanoma",
    nv_Melanocytic_nevi: "Melanocytic Nevi",
    bcc_Basal_cell_carcinoma: "Basal Cell Carcinoma",
  };

  useEffect(() => {
    async function loadModel() {
      try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        modelRef.current = await tmImage.load(modelURL, metadataURL);
        maxPredictionsRef.current = modelRef.current.getTotalClasses();
        setPrediction("Model Loaded");
      } catch (error) {
        setPrediction("Error loading model");
      }
    }
    loadModel();
  }, []);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (!loggedIn) {
      setPrediction("Please login to analyze images");
    }
  }, []);

  const handleImageChange = (event) => {
    if (!isLoggedIn) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    const file = event.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    const file = event.dataTransfer.files[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
      predict(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  async function predict(imageURL) {
    if (!modelRef.current) {
      setPrediction("Model not loaded");
      return;
    }

    const img = new Image();
    img.src = imageURL;
    img.onload = async () => {
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const predictions = await modelRef.current.predict(canvas);
      let bestPrediction = predictions[0];

      for (let i = 1; i < predictions.length; i++) {
        if (predictions[i].probability > bestPrediction.probability) {
          bestPrediction = predictions[i];
        }
      }

      const readableName =
        labelMapping[bestPrediction.className] || bestPrediction.className;
      setPrediction(
        `${readableName} (${(bestPrediction.probability * 100).toFixed(2)}%)`
      );
      setLesionDetected(true);

      saveToDatabase(readableName, imageURL);
    };
  }

  const saveToDatabase = async (lesionType, imageURL) => {

    console.log("uid"+userId)

    if (!userId || !imageURL || !lesionType) {
      toast.error("Missing required data for saving analysis");
      return;
    }
  
    const data = {
      userId, 
      image: imageURL,
      lesionType,
      lesionInfo: lesionData[lesionType] || {
        description: "No description available",
        symptoms: "No symptoms information",
        actions: "Consult a dermatologist",
        treatment: "Treatment information not available",
        prevention: "General skin care recommended",
        link: "https://www.aad.org/public/everyday-care/skin-care-basics"
      },
      doctorInfo: doctorInfo || {
        name: "Dr. Anandi Gopal Joshi",
        qualification: "MD, Dermatology",
        location: "Apollo Hospital, Mumbai",
        phone: "+91 00000 00000",
        email: "dermatology@apollo.com"
      },
      timestamp: new Date().toISOString()
    };
  
    console.log("Sending data to backend:", data);
  
    try {
      const response = await axios.post("http://localhost:5000/save-analysis", data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        toast.success("Analysis saved successfully!");
      } else {
        toast.error(response.data.message || "Failed to save analysis");
      }
    } catch (error) {
      console.error("Server error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Server error while saving");
    }
  };


  const lesionType = prediction.split("(")[0].trim();
  const lesionInfo = lesionData[lesionType];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-32 bg-[#0A0F1C]">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Analyze Your Skin Condition
        </h2>
        <p className="text-gray-400 text-lg mt-2">
          Upload an image of your skin lesion and our AI will analyze it
          instantly.
        </p>
      </div>


      <div
        className={`flex w-full max-w-5xl items-start gap-6 ${
          lesionDetected ? "justify-between" : "justify-center"
        }`}
      >
        <div
          className="w-2xl border border-black/10 bg-white/5 backdrop-blur-md shadow-lg rounded-3xl p-8 transition-all"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="fileUpload"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
          />
          <div
            className="border-2 border-dashed border-gray-300 p-6 rounded-3xl text-center cursor-pointer hover:bg-gray-200/10 transition"
            onClick={() => {
              if (!isLoggedIn) {
                toast.error("Please login first");
                navigate("/login");
                return;
              }
              fileInputRef.current.click(); 
            }}
          >
            {!isLoggedIn ? (
              <div className="flex flex-col items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-700" />
                <p className="text-gray-600 mt-2">
                  Please login to upload images
                </p>
              </div>
            ) : selectedImage ? (
              <img
                src={selectedImage}
                alt="Uploaded"
                className="w-full h-40 object-cover rounded-2xl shadow-md"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-700" />
                <p className="text-gray-600 mt-2">
                  Drag & Drop or Click to Upload
                </p>
              </div>
            )}
          </div>
          <p className="text-center text-lg font-semibold text-gray-400 mt-4">
            {prediction}
          </p>
          <button
            onClick={() => {
              if (!isLoggedIn) {
                toast.error("Please login first");
                navigate("/login");
                return;
              }
              fileInputRef.current.click(); 
            }}
            className="mt-4 flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-sm py-3 rounded-full hover:bg-purple-700 transition"
          >
            <Upload className="w-5 h-5 mr-2" />
            {isLoggedIn ? "Upload Image" : "Login to Upload"}
          </button>
        </div>

        {lesionDetected && lesionInfo && (
          <div className="w-2xl border border-black/10 bg-white/5 backdrop-blur-md shadow-lg rounded-3xl p-6">
            <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
              <Info className="w-6 h-6 text-white" /> {lesionType}
            </h3>
            <hr className="my-4 border-gray-300" />
            <p className="text-gray-400">
              <strong className="text-gray-50">Description:</strong>{" "}
              {lesionInfo.description}
            </p>
            <p className="text-gray-400">
              <strong className="text-gray-50">Symptoms:</strong>{" "}
              {lesionInfo.symptoms}
            </p>
            <p className="text-gray-400">
              <strong className="text-gray-50">Actions:</strong>{" "}
              {lesionInfo.actions}
            </p>
            <p className="text-gray-400">
              <strong className="text-gray-50">Treatment:</strong>{" "}
              {lesionInfo.treatment}
            </p>
            <p className="text-gray-400">
              <strong className="text-gray-50">Prevention:</strong>{" "}
              {lesionInfo.prevention}
            </p>
            <a
              href={lesionInfo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 flex items-center gap-1"
            >
              More Info <ExternalLink className="w-4 h-4" />
            </a>

            {/* Disclaimer Note */}
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-3xl">
              <div className="flex items-start">
                {" "}
                <TriangleAlert className="w-12 h-12 text-yellow-400 mr-2 mt-1" />{" "}
                <p className="text-sm font-semibold">
                  Note: This AI result is not 100% accurate. Please consult a
                  qualified doctor for a professional diagnosis.
                </p>
              </div>
            </div>
            
            {/* Doctor Information */}
            <div className="mt-6 p-6 bg-white/10 border border-white/20 backdrop-blur-md shadow-md rounded-3xl flex flex-col items-center">
              <div className="flex gap-6">
                <img
                  src="https://i.pinimg.com/736x/ad/6c/b0/ad6cb07e44a5e63ffc89d7723b181052.jpg" 
                  alt="Dr. Rajesh Mehta"
                  className="w-auto h-24 object-cover rounded-full border-2 border-gray-300 shadow-md"
                />
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    Recommended Dermatologist
                  </h4>
                  <p className="text-gray-300 text-xl font-medium">
                    Anandi Gopal Joshi
                  </p>
                  <p className="text-gray-400">
                    MD, Dermatology (15+ years experience)
                  </p>
                </div>
              </div>

              <div className="mt-4 w-full">
                <div className="mt-3 space-y-2">
                  <p className="text-gray-400 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-300" /> Apollo
                    Hospital, Mumbai
                  </p>

                  <p className="text-gray-400 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-300" />
                    <a
                      href="tel:+911234567890"
                      className="text-blue-500 hover:underline"
                    >
                      +91 12345 67890
                    </a>
                  </p>

                  <p className="text-gray-400 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-300" />
                    <a
                      href="mailto:dr.rajeshmehta@apollo.com"
                      className="text-blue-500 hover:underline"
                    >
                      dr.anadi@apollo.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <HowItWorks />
      <Toaster />
    </div>
  );
}

export default AnalyzeUpload;
