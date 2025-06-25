import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  User,
  Mail,
  FileText,
  Trash2,
  Upload,
  Download,
  MapPin,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-hot-toast";

const DoctorPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  const searchPatients = async () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/doctor/search`,
        {
          params: {
            [searchType]: searchTerm,
          },
        }
      );
      setPatients(response.data.data);
      if (response.data.data.length === 0) {
        toast.error("No patients found");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search patients");
    } finally {
      setIsLoading(false);
    }
  };

  const getPatientAnalyses = async (userId) => {
    setIsLoading(true);
    try {
      const analysesResponse = await axios.get(
        `http://localhost:5000/api/analyses/${userId}`
      );
      setAnalyses(analysesResponse.data.data);

      const documentsResponse = await axios.get(
        `http://localhost:5000/api/doctor/documents/${userId}`
      );
      setDocuments(documentsResponse.data.data);

      setSelectedPatient(patients.find((p) => p.userId === userId));
    } catch (error) {
      console.error("Error fetching patient data:", error);
      toast.error("Failed to load patient history");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAnalysis = async (analysisId) => {
    if (!window.confirm("Are you sure you want to delete this analysis?"))
      return;

    try {
      await axios.delete(
        `http://localhost:5000/api/doctor/analyses/${analysisId}`
      );
      setAnalyses(analyses.filter((a) => a._id !== analysisId));
      toast.success("Analysis deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete analysis");
    }
  };

  const handleFileUpload = async (userId) => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", userId);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/doctor/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("File uploaded successfully");
        setSelectedFile(null);
        const documentsResponse = await axios.get(
          `http://localhost:5000/api/doctor/documents/${userId}`
        );
        setDocuments(documentsResponse.data.data);
      } else {
        toast.error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    }
  };

  const deleteDocument = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;

    try {
      await axios.delete(
        `http://localhost:5000/api/doctor/documents/${documentId}`
      );
      setDocuments(documents.filter((d) => d._id !== documentId));
      toast.success("Document deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete document");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] py-28">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Doctor Panel
        </h1>

        {/* Search Section */}
        <div className="bg-white/10 rounded-2xl shadow p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 border text-white border-gray-700 rounded-xl leading-5 bg-white/5 placeholder-gray-400 focus:outline-none focus:ring-white focus:ring-1 focus:border-white transition-all duration-500"
                placeholder={`Search by ${searchType}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchPatients()}
              />
            </div>
            <select
              className="block w-full md:w-48 pl-3 pr-10 py-2 text-base border border-gray-700 text-white bg-white/5 focus:outline-none focus:ring-white focus:ring-1 focus:border-white rounded-xl"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              style={{
                appearance: "none",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
              }}
            >
              <option value="name" className="bg-gray-800 text-white">
                Name
              </option>
              <option value="email" className="bg-gray-800 text-white">
                Email
              </option>
              <option value="userId" className="bg-gray-800 text-white">
                User ID
              </option>
            </select>
            <button
              onClick={searchPatients}
              className="inline-flex items-center px-8 py-2 border border-transparent font-medium rounded-xl shadow-sm text-white bg-violet-600 hover:bg-violet-700 duration-300 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? "Search" : "Search"}
            </button>
          </div>

          {/* Search Results */}
          {patients.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-medium text-gray-200 mb-2">
                Search Results
              </h2>
              <div className="overflow-x-auto rounded-2xl">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                      >
                        User ID
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patients.map((patient) => (
                      <tr key={patient.userId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {patient.userId}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {patient.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {patient.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => getPatientAnalyses(patient.userId)}
                            className="text-blue-600 hover:text-blue-900 hover:underline"
                          >
                            View History
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Patient Analysis Section */}
        {selectedPatient && (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="bg-gray-50 px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Patient: {selectedPatient.name} (ID:{" "}
                    {selectedPatient.userId})
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedPatient.email}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <User className="h-3 w-3 mr-1" />
                    {selectedPatient.profile?.age || "N/A"} years
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <MapPin className="h-3 w-3 mr-1" />
                    {selectedPatient.profile?.location || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="p-4 md:p-6 space-y-6">
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Upload Patient Document
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-grow">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <button
                    onClick={() => handleFileUpload(selectedPatient.userId)}
                    disabled={!selectedFile}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload PDF
                  </button>
                </div>
              </div>

              {/* Documents Section */}
              {documents.length > 0 && (
                <div className="bg-white/10 border border-white/20 rounded-3xl backdrop-blur-md overflow-hidden mb-8">
                  <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <FileText className="h-6 w-6 text-blue-400" />
                      <span className="text-gray-800">
                        Patient Documents
                      </span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documents.map((document) => {
                        const pdfUrl = `http://localhost:5000${document.url}`;
                        const displayName = document.filename.replace(
                          /\.pdf$/i,
                          ""
                        ); 
                        const shortenedName =
                          displayName.length > 12
                            ? `${displayName.slice(0, 9)}...`
                            : displayName;

                        return (
                          <div
                            key={document._id}
                            className="bg-white/5 rounded-2xl p-4 border border-gray-200 hover:border-gray-200 transition-all hover:shadow-sm"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-20 h-24 bg-blue-200 rounded-lg flex flex-col items-center justify-center relative group border border-white/10">
                                <FileText className="h-6 w-6 text-blue-500" />
                                <span className="text-xs text-blue-500 mt-2">
                                  PDF
                                </span>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/60 rounded-lg">
                                  <button
                                    onClick={() =>
                                      window.open(pdfUrl, "_blank")
                                    }
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
                                  className="text-gray-600 font-medium truncate"
                                  title={displayName}
                                >
                                  {displayName}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                  {new Date(
                                    document.createdAt
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>

                                <div className="mt-3 flex gap-2">
                                  <a
                                    href={pdfUrl}
                                    download
                                    className="text-xs bg-black/5 hover:bg-white/20 text-gray-500 px-3 py-1.5 rounded-md transition flex items-center gap-1"
                                  >
                                    <Download className="h-5 w-5" />
                                    Download
                                  </a>
                                  <button
                                    onClick={() => deleteDocument(document._id)}
                                    className="text-xs bg-red-600/10 hover:bg-red-600/20 text-red-400 px-3 py-1.5 rounded-md transition flex items-center gap-1"
                                    title="Delete Document"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                    Delete
                                  </button>
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

              {/* Analysis History */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Analysis History
                </h3>

                {analyses.length > 0 ? (
                  <div className="space-y-4">
                    {analyses.map((analysis) => (
                      <div
                        key={analysis._id}
                        className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-md font-medium text-gray-900">
                              {analysis.lesionType}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {new Date(analysis.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                navigate(`/analysis/${analysis._id}`)
                              }
                              className="text-xs bg-gray-400 hover:bg-gray-700 text-white px-3 py-1 cursor-pointer rounded-xl transition"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => deleteAnalysis(analysis._id)}
                              className="text-red-600 hover:text-red-900 p-1 cursor-pointer rounded-full hover:bg-red-50"
                              title="Delete Analysis"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                          <p>
                            {analysis.lesionInfo?.description ||
                              "No description available"}
                          </p>
                        </div>
                        {analysis.lesionInfo?.link && (
                          <div className="mt-3">
                            <a
                              href={analysis.lesionInfo.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                            >
                              Learn more{" "}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">
                      No analysis records found for this patient
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPanel;
