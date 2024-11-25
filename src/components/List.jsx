import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Search,
  Trash2,
  FileText,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://suyashagrahari.work.gd/api/data"
      );
      setCompanies(response.data.data);
      setTotalPages(Math.ceil(response.data.data.length / itemsPerPage));
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
    setIsLoading(false);
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (company.name && company.name.toLowerCase().includes(searchLower)) ||
        (company.websiteUrl &&
          company.websiteUrl.toLowerCase().includes(searchLower))
      );
    });
  }, [companies, searchQuery]);

  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCompanies.slice(startIndex, endIndex);
  }, [filteredCompanies, currentPage]);

  const totalItems = filteredCompanies.length;
  const totalFilteredPages = Math.ceil(totalItems / itemsPerPage);

  const handleDelete = async () => {
    try {
      await axios.post("https://suyashagrahari.work.gd/api/delete", {
        ids: selectedItems,
      });
      fetchCompanies();
      setSelectedItems([]);
    } catch (error) {
      console.error("Error deleting companies:", error);
    }
  };

  const handleExportCSV = async () => {
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
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === paginatedCompanies.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedCompanies.map((company) => company._id));
    }
  };

  const toggleSelectItem = (e, id) => {
    e.stopPropagation();
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const copyToClipboard = (e, text) => {
    e.stopPropagation();
    if (text && text !== "N/A") {
      navigator.clipboard.writeText(text);
    }
  };

  const renderSocialIcons = (company) => {
    return (
      <div className="flex gap-1 md:gap-2" onClick={(e) => e.stopPropagation()}>
        {company.facebookUrl && (
          <a
            href={company.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1">
            <Facebook className="w-3 h-3 md:w-4 md:h-4 text-gray-500 hover:text-blue-600" />
          </a>
        )}
        {company.twitterUrl && (
          <a
            href={company.twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1">
            <Twitter className="w-3 h-3 md:w-4 md:h-4 text-gray-500 hover:text-blue-400" />
          </a>
        )}
        {company.linkedinUrl && (
          <a
            href={company.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1">
            <Linkedin className="w-3 h-3 md:w-4 md:h-4 text-gray-500 hover:text-blue-700" />
          </a>
        )}
        {company.instagramUrl && (
          <a
            href={company.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1">
            <Instagram className="w-3 h-3 md:w-4 md:h-4 text-gray-500 hover:text-pink-600" />
          </a>
        )}
        {!company.facebookUrl &&
          !company.twitterUrl &&
          !company.linkedinUrl &&
          !company.instagramUrl && (
            <span className="text-xs md:text-sm text-gray-500">N/A</span>
          )}
      </div>
    );
  };

  const getPaginationNumbers = () => {
    const pages = [];
    if (totalFilteredPages <= 7) {
      for (let i = 1; i <= totalFilteredPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) pages.push(i);
        pages.push("...");
        pages.push(totalFilteredPages);
      } else if (currentPage >= totalFilteredPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalFilteredPages - 2; i <= totalFilteredPages; i++)
          pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalFilteredPages);
      }
    }
    return pages;
  };

  const handleRowClick = (companyId) => {
    navigate(`/company/${companyId}`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <nav className="flex flex-row items-center space-x-3 p-3 rounded-lg text-sm bg-purple-100 w-[7rem] shadow-md">
        <Link
          to="/"
          className="text-muted-foreground hover:text-primary flex gap-2 text-purple-700 transition-colors font-bold">
          <Home className="h-5 w-5" /> {/* Add a home icon for visual appeal */}
          Home
        </Link>
      </nav>
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-[50%] relative">
          <input
            type="text"
            placeholder="Enter domain name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:max-w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm md:text-base"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
        </div>
        <button className="w-full md:w-auto px-6 py-2 bg-purple-200 hover:bg-purple-700 hover:text-white text-purple-700 rounded-lg transition duration-200 ease-in-out text-xs md:text-sm font-medium">
          Fetch & Save Details
        </button>
      </div>

      {/* Selected Count and Actions */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-xs md:text-sm text-gray-500">
          {selectedItems.length} selected
        </span>
        <button
          onClick={handleDelete}
          className={`px-3 py-1 border border-gray-300 rounded-md text-red-600 flex items-center gap-2 text-xs md:text-sm ${
            selectedItems.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-red-50"
          }`}
          disabled={selectedItems.length === 0}>
          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
          Delete
        </button>
        <button
          onClick={handleExportCSV}
          className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2 text-xs md:text-sm">
          <FileText className="w-3 h-3 md:w-4 md:h-4" />
          Export as CSV
        </button>
      </div>

      {/* Company Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="p-2 md:p-4">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === paginatedCompanies.length
                      }
                      onChange={toggleSelectAll}
                      className="rounded md:ml-[-0.65rem] 2xl:ml-[-1.5rem] border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  <th
                    scope="col"
                    className="p-2 md:p-4 text-left text-xs md:text-sm font-semibold text-gray-900">
                    COMPANY
                  </th>
                  <th
                    scope="col"
                    className="p-2 md:p-4 text-left text-xs md:text-sm font-semibold text-gray-900">
                    SOCIAL
                  </th>
                  <th
                    scope="col"
                    className="p-2 md:p-4 text-left text-xs md:text-sm font-semibold text-gray-900">
                    DESCRIPTION
                  </th>
                  <th
                    scope="col"
                    className="p-2 md:p-4 text-left text-xs md:text-sm font-semibold text-gray-900">
                    ADDRESS
                  </th>
                  <th
                    scope="col"
                    className="p-2 md:p-4 text-left text-xs md:text-sm font-semibold text-gray-900">
                    PHONE
                  </th>
                  <th
                    scope="col"
                    className="p-2 md:p-4 text-left text-xs md:text-sm font-semibold text-gray-900">
                    EMAIL
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-sm">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  paginatedCompanies.map((company) => (
                    <tr
                      key={company._id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRowClick(company._id)}>
                      <td className="p-2 md:p-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(company._id)}
                          onChange={(e) => toggleSelectItem(e, company._id)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="pr-10 md:pr-10 ">
                        <div className="flex items-center gap-2 md:gap-3">
                          <img
                            src={
                              company.logo ||
                              "/placeholder.svg?height=32&width=32"
                            }
                            alt={company.name || "Company logo"}
                            className="w-6 h-6 md:w-8 md:h-8 rounded"
                          />
                          <span className="font-medium text-xs md:text-sm">
                            {company.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="p-2 md:p-4">
                        {renderSocialIcons(company)}
                      </td>
                      <td className="p-2 md:p-4">
                        <div className="max-w-[150px] md:max-w-xl truncate text-xs md:text-sm">
                          {company.description || "N/A"}
                        </div>
                      </td>
                      <td className="p-2 md:p-4">
                        <div className="max-w-[100px] md:max-w-xs truncate text-xs md:text-sm">
                          {company.address || "N/A"}
                        </div>
                      </td>
                      <td className="p-2 md:p-4">
                        <div className="flex items-center gap-1 md:gap-2">
                          <span className="text-xs md:text-sm">
                            {company.phoneNumbers &&
                            company.phoneNumbers.length > 0
                              ? company.phoneNumbers[0]
                              : "N/A"}
                          </span>
                          {company.phoneNumbers &&
                            company.phoneNumbers.length > 0 && (
                              <button
                                onClick={(e) =>
                                  copyToClipboard(e, company.phoneNumbers[0])
                                }
                                className="p-1 hover:bg-gray-200 rounded-full">
                                <Copy className="h-3 w-3 md:h-4 md:w-4 text-gray-500" />
                              </button>
                            )}
                        </div>
                      </td>
                      <td className="p-2 md:p-4">
                        <div className="flex items-center gap-1 md:gap-2">
                          <span className="text-xs md:text-sm">
                            {company.email || "N/A"}
                          </span>
                          {company.email && (
                            <button
                              onClick={(e) => copyToClipboard(e, company.email)}
                              className="p-1 hover:bg-gray-200 rounded-full">
                              <Copy className="h-3 w-3 md:h-4 md:w-4 text-gray-500" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="text-xs md:text-sm text-gray-700">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} -{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 md:p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50">
            <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
          </button>
          <div className="flex space-x-1 md:space-x-2">
            {getPaginationNumbers().map((pageNum, idx) => (
              <React.Fragment key={idx}>
                {pageNum === "..." ? (
                  <span className="px-1 md:px-2 text-xs md:text-sm">...</span>
                ) : (
                  <button
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-md text-xs md:text-sm ${
                      currentPage === pageNum
                        ? "bg-purple-200 text-purple-700"
                        : "border hover:bg-gray-50"
                    }`}>
                    {pageNum}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalFilteredPages))
            }
            disabled={currentPage === totalFilteredPages}
            className="p-1 md:p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50">
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompanyList;
