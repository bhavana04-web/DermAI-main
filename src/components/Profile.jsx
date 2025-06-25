import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LogOut,
  User,
  Mail,
  MapPin,
  Calendar,
  ClipboardList,
  FileText,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = localStorage.getItem("user");
      const userId = localStorage.getItem("userId");

      if (!storedUser) {
        navigate("/login");
        return;
      }

      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);

        const response = await axios.get(
          `http://localhost:5000/api/analyses/${userId}`
        );

        if (response.data.success) {
          setAnalyses(response.data.data);
        }
        const documentsResponse = await axios.get(
          `http://localhost:5000/api/doctor/documents/${userId}`
        );

        if (documentsResponse.data.success) {
          setDocuments(documentsResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const openPdf = (pdfUrl) => {
    window.open(`http://localhost:5000${pdfUrl}`, "_blank");
  };

  const handleSignOut = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0F1C]">
        <div className="text-white text-xl animate-pulse">
          Loading profile data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C] py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* User Profile Section */}
        <div className="bg-white/10 border border-white/20 rounded-3xl backdrop-blur-md overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-4 flex items-center justify-center">
                <User className="h-16 w-16 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Profile Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                    <User className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Name</p>
                      <p className="text-white font-medium">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                    <Mail className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                    <ClipboardList className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">User ID</p>
                      <p className="text-white font-medium">{user.userId}</p>
                    </div>
                  </div>

                  {user.profile?.age && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                      <Calendar className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">Age</p>
                        <p className="text-white font-medium">
                          {user.profile.age}
                        </p>
                      </div>
                    </div>
                  )}

                  {user.profile?.location && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                      <MapPin className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="text-white font-medium">
                          {user.profile.location}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 px-6 py-4 flex justify-end border-t border-white/10">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/90 hover:bg-red-700 text-white rounded-full text-sm font-medium transition"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>

        {documents.length > 0 && (
          <div className="bg-white/10 border border-white/20 rounded-3xl backdrop-blur-md overflow-hidden mb-8">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-400" />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Your Medical Documents
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc) => {
                  const pdfUrl = `http://localhost:5000${doc.url}`;
                  const displayName = doc.filename.replace(/\.pdf$/i, ""); 
                  const shortenedName =
                    displayName.length > 12
                      ? `${displayName.slice(0, 9)}...`
                      : displayName;

                  return (
                    <div
                      key={doc._id}
                      className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-white duration-500 transition-all hover:shadow-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-24 bg-gray-800/50 rounded-lg flex flex-col items-center justify-center relative group border border-white/10">
                          <FileText className="h-6 w-6 text-blue-400" />
                          <span className="text-xs text-gray-400 mt-2">
                            PDF
                          </span>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/60 rounded-lg">
                            <button
                              onClick={() => window.open(pdfUrl, "_blank")}
                              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded flex items-center gap-1"
                            >
                              <FileText className="h-3 w-3" />
                              View
                            </button>
                          </div>
                        </div>

                        {/* Document Info */}
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-white font-medium truncate"
                            title={displayName}
                          >
                            {displayName}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1 flex items-center">
                            <Calendar className="h-3 w-3 mr-1.5 flex-shrink-0" />
                            {new Date(doc.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>

                          <div className="mt-3 flex gap-2">
                            <a
                              href={pdfUrl}
                              download
                              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition flex items-center gap-1"
                            >
                              <Download className="h-5 w-5" />
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Analysis History Section */}
        <div className="bg-white/10 border border-white/20 rounded-3xl backdrop-blur-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-blue-400" />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Your Skin Analysis History
              </span>
            </h2>

            {analyses.length > 0 ? (
              <div className="space-y-4">
                {analyses.map((analysis, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-white duration-500 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex-shrink-0 relative">
                        <img
                          src={analysis.image}
                          alt="Skin analysis"
                          className="w-32 h-32 object-cover rounded-2xl border border-white/10"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {analysis.lesionType}
                          </h3>
                          <span className="text-xs bg-white/10 text-white px-2 py-1 rounded-full">
                            {formatDate(analysis.timestamp).split(",")[0]}
                          </span>
                        </div>

                        <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                          {analysis.lesionInfo.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="bg-white/5 p-3 rounded-lg">
                            <p className="text-gray-400 mb-1">Analysis Date</p>
                            <p className="text-white font-medium">
                              {formatDate(analysis.timestamp)}
                            </p>
                          </div>

                          <div className="bg-white/5 p-3 rounded-lg">
                            <p className="text-gray-400 mb-1">
                              Recommended Doctor
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                              <p className="text-white font-medium">
                                {analysis.doctorInfo.name}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <a
                            href={analysis.lesionInfo.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm transition"
                          >
                            Learn more about this condition
                          </a>
                          <button
                            className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition"
                            onClick={() =>
                              navigate(`/analysis/${analysis._id}`)
                            }
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-white/5 rounded-2xl p-8 border border-dashed border-white/20 mb-6">
                  <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">
                    No analysis history found
                  </p>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    You haven't analyzed any skin conditions yet. Get started by
                    uploading an image.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition"
                >
                  Analyze Your First Image
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
