import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Download,
  Trash2,
  CheckSquare,
  Square,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import debounce from "lodash/debounce";
import ExpandableCompanyCard from "./ExpandableCompanyCard";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        "https://suyashagrahari.work.gd/api/data"
      );
      setCompanies(response.data.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError("Failed to fetch company data.");
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((searchTerm) => {
        setCurrentPage(1);
        setSearchTerm(searchTerm);
      }, 300),
    []
  );

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) =>
      Object.values(company).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [companies, searchTerm]);

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

  const handleCheckboxChange = (id, event) => {
    event.stopPropagation();
    setSelectedCompanies((prev) =>
      prev.includes(id)
        ? prev.filter((companyId) => companyId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedCompanies(
      selectedCompanies.length === currentCompanies.length
        ? []
        : currentCompanies.map((company) => company._id)
    );
  };

  const handleDelete = async () => {
    try {
      await axios.post("https://suyashagrahari.work.gd/api/delete", {
        ids: selectedCompanies,
      });
      fetchCompanies();
      setSelectedCompanies([]);
    } catch (error) {
      console.error("Error deleting companies:", error);
      setError("Failed to delete selected companies.");
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await axios.get(
        "https://suyashagrahari.work.gd/api/download-csv",
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "companies.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading CSV:", error);
      setError("Failed to download CSV file.");
    }
  };

  const handleRowClick = (companyId, event) => {
    if (event.target.type !== "checkbox") {
      navigate(`/company/${companyId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-7xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
            <h1 className="text-2xl md:text-3xl font-bold">Company List</h1>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-4 mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search companies..."
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center">
                  {selectedCompanies.length === currentCompanies.length ? (
                    <Square className="h-4 w-4 mr-2" />
                  ) : (
                    <CheckSquare className="h-4 w-4 mr-2" />
                  )}
                  {selectedCompanies.length === currentCompanies.length
                    ? "Deselect All"
                    : "Select All"}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={selectedCompanies.length === 0}
                    className={`p-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center ${
                      selectedCompanies.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}>
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleDownloadCSV}
                    className="p-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center">
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {currentCompanies.map((company) => (
                  <ExpandableCompanyCard
                    key={company._id}
                    company={company}
                    isSelected={selectedCompanies.includes(company._id)}
                    onSelect={handleCheckboxChange}
                    onClick={handleRowClick}
                  />
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
              <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredCompanies.length)} of{" "}
                {filteredCompanies.length} results
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md border ${
                    currentPage === 1
                      ? "bg-gray-100 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}>
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-2 rounded-md text-sm ${
                        currentPage === pageNumber
                          ? "bg-indigo-600 text-white"
                          : "hover:bg-gray-50"
                      }`}>
                      {pageNumber}
                    </button>
                  );
                })}

                {totalPages > 5 && <span className="px-2">...</span>}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md border ${
                    currentPage === totalPages
                      ? "bg-gray-100 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CompanyList;
