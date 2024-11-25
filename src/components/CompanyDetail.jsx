import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  Home,
  ChevronRight,
  Info,
  Phone,
  Mail,
  Globe,
  Camera,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  MapPin,
} from "lucide-react";

const CompanyDetail = () => {
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { companyId } = useParams();

  useEffect(() => {
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

    fetchCompanyDetails();
  }, [companyId]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-500 font-medium">
        {error}
      </div>
    );
  if (!company)
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        No company data available.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Breadcrumb */}
      <div className="border-b bg-white shadow-sm">
        <div className="mx-auto w-[100%] px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              to="/list"
              className="text-muted-foreground hover:text-primary transition-colors font-bold">
              {/* <Home className="h-4 w-4" /> */}
              List
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-bold text-foreground">{company.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-[100%] p-4 space-y-3">
        {/* Company Header */}
        <div className="grid md:grid-cols-2 gap-8 rounded-lg bg-white p-6 shadow-sm">
          {/* Logo and Description */}
          <div className="flex sm:flex-row flex-col gap-5">
            <img
              src={company.logo || "/placeholder.png"}
              alt={company.name}
              className="h-32 w-32 rounded-lg object-cover border shadow-sm"
            />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {company.name}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600 font-semibold">
                <Info className="h-4 w-4 font-bold" />
                <span className="font-bold">Description</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {company.description || "No description available"}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 md:border-l md:pl-8">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 font-semibold">
                <Phone className="h-4 w-4 text-primary font-bold" />
                <span className="font-bold text-foreground">Phone</span>
              </div>
              <a
                href={`tel:${company.phoneNumbers?.[0]}`}
                className="text-sm text-primary hover:underline">
                {company.phoneNumbers?.[0] || "N/A"}
              </a>
            </div>
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 font-semibold">
                <Mail className="h-4 w-4 text-primary font-bold" />
                <span className="font-bold text-foreground">Email</span>
              </div>
              <a
                href={`mailto:${company.email}`}
                className="text-sm text-primary hover:underline">
                {company.email || "N/A"}
              </a>
            </div>
          </div>
        </div>

        {/* Company Details and Screenshot */}
        <div className="grid lg:grid-cols-3 gap-3">
          {/* Company Details */}
          <div className="bg-white p-5 rounded-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Company Details
            </h2>
            <div className="space-y-4 rounded-lg ">
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 font-semibold">
                  <Globe className="h-4 w-4 font-bold" />
                  <span className="font-bold">Website</span>
                </div>
                <p className="text-sm text-gray-900">
                  {company.websiteUrl
                    ? new URL(company.websiteUrl).hostname
                    : "N/A"}
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 font-bold">
                  <Info className="h-4 w-4" />
                  <span>Description</span>
                </div>
                <p className="text-sm text-gray-900">
                  {company.description || "N/A"}
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 font-bold">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </div>
                <p className="text-sm text-gray-900">
                  {company.email || "N/A"}
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 font-bold">
                  <Facebook className="h-4 w-4" />
                  <span>Facebook</span>
                </div>
                <a
                  href={company.facebookUrl}
                  className="text-sm text-purple-600 hover:underline">
                  {company.facebookUrl || "N/A"}
                </a>
              </div>
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 font-bold">
                  <Instagram className="h-4 w-4" />
                  <span>Instagram</span>
                </div>
                <a
                  href={company.instagramUrl}
                  className="text-sm text-purple-600 hover:underline">
                  {company.instagramUrl || "N/A"}
                </a>
              </div>
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 font-bold">
                  <Twitter className="h-4 w-4" />
                  <span>Twitter</span>
                </div>
                <a
                  href={company.twitterUrl}
                  className="text-sm text-purple-600 hover:underline">
                  {company.twitterUrl || "N/A"}
                </a>
              </div>
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 font-bold">
                  <Linkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                </div>
                <a
                  href={company.linkedinUrl}
                  className="text-sm text-purple-600 hover:underline">
                  {company.linkedinUrl || "N/A"}
                </a>
              </div>
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 font-bold">
                  <MapPin className="h-4 w-4" />
                  <span>Address</span>
                </div>
                <p className="text-sm text-gray-900">
                  {company.address || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Screenshot */}
          <div className="lg:col-span-2 bg-white p-5 rounded-md">
            <h2 className="flex items-center space-x-2 text-lg font-semibold text-foreground mb-4">
              <Camera className="h-5 w-5 text-primary" />
              <span>Screenshot of Webpage</span>
            </h2>
            <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
              {company.screenshotUrl ? (
                <img
                  src={company.screenshotUrl}
                  alt="Website Screenshot"
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="flex h-64 items-center justify-center bg-gray-50 text-sm text-muted-foreground">
                  No screenshot available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
