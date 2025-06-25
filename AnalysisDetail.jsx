import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ExternalLink, Phone, Mail, MapPin, User } from "lucide-react";
import toast from "react-hot-toast";

const AnalysisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/analyses/single/${id}`);
        if (response.data.success) {
          setAnalysis(response.data.data);
        } else {
          toast.error("Analysis not found");
          navigate("/profile");
        }
      } catch (error) {
        console.error("Error fetching analysis:", error);
        toast.error("Failed to load analysis details");
        navigate("/profile");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0F1C]">
        <div className="text-white text-xl animate-pulse">Loading analysis details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 mb-6 text-blue-400 hover:text-blue-300 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Profile
        </button>

        <div className="bg-white/10 border border-white/20 rounded-3xl backdrop-blur-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <img 
                  src={analysis.image} 
                  alt="Skin analysis" 
                  className="w-full max-w-xs rounded-xl border border-white/10"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {analysis.lesionType}
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                  Analyzed on {formatDate(analysis.timestamp)}
                </p>

                <div className="bg-white/5 rounded-xl p-5 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Condition Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Description</p>
                      <p className="text-white">{analysis.lesionInfo.description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Symptoms</p>
                      <p className="text-white">{analysis.lesionInfo.symptoms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Recommended Actions</p>
                      <p className="text-white">{analysis.lesionInfo.actions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Treatment Options</p>
                      <p className="text-white">{analysis.lesionInfo.treatment}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Prevention</p>
                      <p className="text-white">{analysis.lesionInfo.prevention}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-white mb-3">Recommended Specialist</h3>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-blue-600/20 p-3 rounded-full">
                      <User className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{analysis.doctorInfo.name}</p>
                      <p className="text-gray-400 text-sm">{analysis.doctorInfo.qualification}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      <p className="text-white">{analysis.doctorInfo.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-400" />
                      <a href={`tel:${analysis.doctorInfo.phone}`} className="text-white hover:underline">
                        {analysis.doctorInfo.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-400" />
                      <a href={`mailto:${analysis.doctorInfo.email}`} className="text-white hover:underline">
                        {analysis.doctorInfo.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href={analysis.lesionInfo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Learn more about this condition
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDetail;