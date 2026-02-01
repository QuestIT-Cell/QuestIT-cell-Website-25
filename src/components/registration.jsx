"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { saveToGoogleSheet } from "@/lib/sheety";

const Registration = () => {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    division: "",
    rollNumber: "",
    phoneNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const divisions = ["D10A", "D10B", "D10C", "D15A", "D15B", "D15C"];

  const words = [
    {
      text: "Registration",
    },
    {
      text: "Form",
    },
    {
      text: "-",
    },
    {
      text: "QuestIT",
      className: "!text-cyan-300",
    },
    {
      text: "Cell",
      className: "!text-cyan-300",
    },
  ];

  const description = `Register for our latest workshop and join the QuestIT community. Fill in all the required details below to secure your spot.`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { email, fullName, division, rollNumber, phoneNumber } = formData;

    if (!email || !fullName || !division || !rollNumber || !phoneNumber) {
      return false;
    }

    // VES email validation
    if (!email.endsWith("@ves.ac.in")) {
      return false;
    }

    // Phone number validation (10 digits)
    if (!/^\d{10}$/.test(phoneNumber)) {
      return false;
    }

    return true;
  };

  const saveToLocalStorage = (data) => {
    try {
      // Get existing registrations from localStorage
      const existingRegistrations = localStorage.getItem('questit_registrations');
      const registrations = existingRegistrations ? JSON.parse(existingRegistrations) : [];

      // Add new registration with timestamp and unique ID
      const newRegistration = {
        id: Date.now(), // Simple unique ID
        ...data,
        timestamp: new Date().toISOString(),
        submittedAt: new Date().toLocaleString(),
      };

      registrations.push(newRegistration);

      // Save back to localStorage
      localStorage.setItem('questit_registrations', JSON.stringify(registrations));

      console.log("Registration saved to localStorage:", newRegistration);
      console.log("Total registrations:", registrations.length);

      return true;
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus({
        type: "error",
        message: "Please fill all required fields correctly. Email must be VES domain (@ves.ac.in) and phone number must be 10 digits.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Save to Google Sheet via Sheety API
      const sheetResult = await saveToGoogleSheet(formData);

      if (sheetResult.success) {
        // Also save to localStorage as backup
        saveToLocalStorage(formData);

        setSubmitStatus({
          type: "success",
          message: "Registration submitted successfully! Your details have been saved.",
        });

        // Clear form
        setFormData({
          email: "",
          fullName: "",
          division: "",
          rollNumber: "",
          phoneNumber: "",
        });
      } else {
        // If Google Sheet fails, still save to localStorage
        const localSaved = saveToLocalStorage(formData);

        setSubmitStatus({
          type: localSaved ? "warning" : "error",
          message: localSaved
            ? "Registration saved locally. There was an issue with our main database, but your data is secure."
            : `Failed to save registration: ${sheetResult.error}`,
        });
      }
    } catch (error) {
      // Fallback to localStorage if API fails
      const localSaved = saveToLocalStorage(formData);

      setSubmitStatus({
        type: localSaved ? "warning" : "error",
        message: localSaved
          ? "Registration saved locally. Please check your internet connection."
          : "Failed to save registration. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 pt-36 pb-20">
      {/* Header Section */}
      <TypewriterEffect words={words} className="pb-12" />

      <TextGenerateEffect
        words={description}
        className="bg-neutral-900 rounded-xl p-7 max-w-2xl mx-auto mb-12"
      />

      {/* Registration Form */}
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-neutral-900 rounded-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email (VES only) *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="VES_Email_ID"
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                required
              />
            </div>

            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-white mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                required
              />
            </div>

            {/* Division Dropdown */}
            <div>
              <label htmlFor="division" className="block text-sm font-medium text-white mb-2">
                Division *
              </label>
              <select
                id="division"
                name="division"
                value={formData.division}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                required
              >
                <option value="" className="bg-neutral-800">Select Division</option>
                {divisions.map((div) => (
                  <option key={div} value={div} className="bg-neutral-800">
                    {div}
                  </option>
                ))}
              </select>
            </div>

            {/* Roll Number Field */}
            <div>
              <label htmlFor="rollNumber" className="block text-sm font-medium text-white mb-2">
                Roll Number *
              </label>
              <input
                type="text"
                id="rollNumber"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleInputChange}
                placeholder="Enter your roll number"
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                required
              />
            </div>

            {/* Phone Number Field */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-white mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter 10-digit phone number"
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                required
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0px_2px_0px_0px_#FFFFFF40_inset]"
            >
              {isSubmitting ? "Submitting..." : "Register Now"}
            </motion.button>

            {/* Status Message */}
            {submitStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg text-center ${submitStatus.type === "success"
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : submitStatus.type === "warning"
                      ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}
              >
                {submitStatus.message}
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Registration;