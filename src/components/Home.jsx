import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Globe, Loader2, List } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const Home = () => {
  const [url, setUrl] = useState("");
  const [scrapedData, setScrapedData] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleScrape = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://suyashagrahari.work.gd/api/scrape",
        { url }
      );
      setScrapedData(response.data.data);
      setScreenshot(response.data.data.screenshotUrl);
      toast.success("Website scraped successfully!");
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(
        "Failed to scrape the website. Please check the URL and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (scrapedData) {
      try {
        await axios.post(
          "https://suyashagrahari.work.gd/api/save",
          scrapedData
        );
        toast.success("Data saved successfully!");
        navigate("/list");
      } catch (error) {
        console.error("Error saving data:", error.message);
        toast.error("Failed to save the scraped data.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 sm:p-8">
      <Toaster position="top-right" />
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-6xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center justify-center w-full sm:w-auto">
                <Globe className="h-8 w-8 sm:h-6 sm:w-6" />
                <h1 className="text-3xl sm:text-4xl font-bold ml-3">
                  Web Scraper Pro
                </h1>
              </div>
              <button
                onClick={() => navigate("/list")}
                className="w-full sm:w-auto px-6 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white hover:text-indigo-600 transition-colors duration-200 flex items-center justify-center gap-2">
                <List className="h-4 w-4" />
                View List
              </button>
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-600 mb-6 text-center sm:text-left">
              Enter a URL to scrape website data and capture a screenshot.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
              <input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={handleScrape}
                disabled={isLoading}
                className={`w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center justify-center ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Scraping...
                  </>
                ) : (
                  "Scrape"
                )}
              </button>
            </div>

            <AnimatePresence>
              {scrapedData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-1/2 order-2 lg:order-1">
                      <h2 className="text-2xl font-bold mb-4">Scraped Data</h2>
                      <div className="space-y-4 bg-gray-50 p-6 rounded-xl shadow-inner">
                        {Object.entries(scrapedData).map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </label>
                            <input
                              value={
                                Array.isArray(value)
                                  ? value.join(", ")
                                  : value || "N/A"
                              }
                              readOnly
                              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={handleSave}
                        className="mt-6 w-full px-6 py-3 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200">
                        Save Data
                      </button>
                    </div>
                    <div className="w-full lg:w-1/2 order-1 lg:order-2">
                      <h2 className="text-2xl font-bold mb-4">Screenshot</h2>
                      {screenshot && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="rounded-xl overflow-hidden shadow-lg">
                          <img
                            src={screenshot}
                            alt="Website Screenshot"
                            className="w-full h-auto rounded-xl"
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
