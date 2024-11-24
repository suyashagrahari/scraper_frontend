import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Phone,
  Calendar,
  Mail,
  Building2,
  ArrowUpRight,
  Globe,
} from "lucide-react";

const ExpandableCompanyCard = ({ company, isSelected, onSelect, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    onSelect(company._id, e);
  };

  const handleCardClick = (e) => {
    if (e.target.type !== "checkbox") {
      onClick(company._id, e);
    }
  };

  const socialIcons = [
    {
      url: company.facebookUrl,
      icon: Facebook,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      url: company.twitterUrl,
      icon: Twitter,
      bg: "bg-sky-50",
      iconColor: "text-sky-600",
    },
    {
      url: company.linkedinUrl,
      icon: Linkedin,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      url: company.instagramUrl,
      icon: Instagram,
      bg: "bg-pink-50",
      iconColor: "text-pink-600",
    },
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 mb-4 border border-gray-100 overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={toggleExpand}>
        <div className="flex  items-center space-x-4">
          <motion.div whileTap={{ scale: 0.95 }} onClick={handleCheckboxChange}>
            {isSelected ? (
              <CheckSquare className="h-6 w-6 text-indigo-600" />
            ) : (
              <Square className="h-6 w-6 text-gray-400" />
            )}
          </motion.div>
          {/* <Building2 className="h-6 w-6 text-gray-400" /> */}
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-lg font-semibold text-indigo-600">
                {company.name.charAt(0)}
              </span>
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900">
            {company.name}
          </h3>
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}>
          {isExpanded ? (
            <ChevronUp className="h-6 w-6 text-gray-500" />
          ) : (
            <ChevronDown className="h-6 w-6 text-gray-500" />
          )}
        </motion.div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8"
            onClick={handleCardClick}>
            <div className="flex flex-col sm:flex-row items-start mb-6 relative">
              <div className="mb-4 sm:mb-0 sm:mr-6 flex justify-center sm:justify-start w-full sm:w-auto">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-teal-50 flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-3xl font-semibold text-teal-600">
                      {company.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {company.name}
                </h3>
                <p className="text-sm text-gray-600 max-w-md mb-4">
                  {company.description || "No description available"}
                </p>
                {company.websiteUrl && (
                  <a
                    href={company.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors">
                    <Globe className="h-4 w-4 mr-1" />
                    Visit Website
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </a>
                )}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3 text-gray-600">
                <div className="bg-teal-50 p-2 rounded-lg">
                  <Building2 className="h-5 w-5 text-teal-600" />
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Company ID</p>
                  <p className="font-medium">
                    {company._id || "Not available"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <div className="bg-teal-50 p-2 rounded-lg">
                  <Phone className="h-5 w-5 text-teal-600" />
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">
                    {(company.phoneNumbers && company.phoneNumbers[0]) ||
                      "Not available"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <div className="bg-teal-50 p-2 rounded-lg">
                  <Mail className="h-5 w-5 text-teal-600" />
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">
                    {company.email || "Not available"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <div className="bg-teal-50 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-teal-600" />
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Created At</p>
                  <p className="font-medium">
                    {company.createdAt
                      ? new Date(company.createdAt).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center border-t pt-4">
              <div className="flex gap-4">
                {socialIcons.map((social, index) =>
                  social.url ? (
                    <motion.a
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`${social.bg} p-2 rounded-lg group transition-colors hover:bg-opacity-80`}>
                      <social.icon
                        className={`h-5 w-5 ${social.iconColor} group-hover:text-opacity-80`}
                      />
                    </motion.a>
                  ) : null
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExpandableCompanyCard;
