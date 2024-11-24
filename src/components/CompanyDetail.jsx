import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Globe,
  Phone,
  ArrowLeft,
  Calendar,
  Clock,
} from "lucide-react";

const CompanyDetail = () => {
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { companyId } = useParams();

  const fetchCompanyDetails = async () => {
    try {
      const response = await axios.get(
        `https://suyashagrahari.work.gd/api/data/${companyId}`
      );
      setCompany(response.data.data);
    } catch (error) {
      console.error("Error fetching company details:", error.message);
      setError("Failed to fetch company details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCompanyDetails();
    }, 1000);

    return () => clearTimeout(timer);
  }, [companyId]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="flex items-center gap-2 rounded-lg bg-white p-4 shadow-lg">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
          <span className="text-lg font-medium text-purple-600">
            Loading...
          </span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <div className="text-center text-red-500">
            <h2 className="mb-2 text-xl font-bold">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center space-x-2 text-sm text-gray-600">
          <a href="/list" className="flex items-center hover:text-purple-600">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to List
          </a>
          <span>/</span>
          <span className="text-gray-900">
            {company?.name || "Company Details"}
          </span>
        </nav>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-2 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8 sm:p-10 rounded-xl shadow-lg">
          {/* Left Column - Company Details */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            className="space-y-8">
            {/* Company Info Card */}
            <div className="overflow-hidden rounded-lg bg-white shadow-lg">
              <div className="p-6">
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                  {company?.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-20 w-20 rounded-lg object-cover shadow-lg"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      {company?.name?.charAt(0) || "?"}
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                      {company?.name || "Company Name Not Available"}
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                      {company?.description || "No description available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info Card */}
            <motion.div
              variants={cardVariants}
              className="overflow-hidden rounded-lg bg-white shadow-lg">
              <div className="p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  {company?.websiteUrl && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-purple-600" />
                      <a
                        href={company.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline">
                        {company.websiteUrl}
                      </a>
                    </div>
                  )}
                  {company?.phoneNumbers && company.phoneNumbers.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-purple-600" />
                      <span>{company.phoneNumbers[0]}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Social Media Card */}
            <motion.div
              variants={cardVariants}
              className="overflow-hidden rounded-lg bg-white shadow-lg">
              <div className="p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Social Media
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {company?.facebookUrl && (
                    <a
                      href={company.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-blue-700 transition-colors hover:bg-blue-100">
                      <Facebook className="h-5 w-5" />
                      <span>Facebook</span>
                    </a>
                  )}
                  {company?.twitterUrl && (
                    <a
                      href={company.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-blue-400 transition-colors hover:bg-blue-100">
                      <Twitter className="h-5 w-5" />
                      <span>Twitter</span>
                    </a>
                  )}
                  {company?.linkedinUrl && (
                    <a
                      href={company.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-blue-700 transition-colors hover:bg-blue-100">
                      <Linkedin className="h-5 w-5" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {company?.instagramUrl && (
                    <a
                      href={company.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-pink-50 p-3 text-pink-600 transition-colors hover:bg-pink-100">
                      <Instagram className="h-5 w-5" />
                      <span>Instagram</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
            {/* Additional Info Card */}
            <motion.div
              variants={cardVariants}
              className="overflow-hidden rounded-lg bg-white shadow-lg">
              <div className="p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Additional Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <span>
                      Created:{" "}
                      {new Date(company?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span>
                      Last Updated:{" "}
                      {new Date(company?.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Screenshot and Additional Info */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8">
            {/* Screenshot Card */}
            <div className="overflow-hidden rounded-lg bg-white shadow-lg">
              <div className="p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Website Screenshot
                </h2>
                {company?.screenshotUrl ? (
                  <img
                    src={company.screenshotUrl}
                    alt="Website Screenshot"
                    className="w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-[400px] items-center justify-center bg-gray-50 text-gray-400">
                    No screenshot available
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyDetail;
