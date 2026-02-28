"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { saveToGoogleSheetFeedback } from "@/lib/sheety";

const Feedback = () => {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    division: "",
    rollNumber: "",
    satisfaction: "",
    relevance: "",
    keyTakeaways: "",
    additionalComments: "",
    suggestions: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const divisions = ["D10A", "D10B", "D10C", "D15A", "D15B", "D15C"];

  const words = [
    {
      text: "Feedback",
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

  const description = `Help us improve our workshops by sharing your valuable feedback. Your input helps us create better learning experiences for everyone.`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { email, fullName, division, rollNumber, satisfaction, relevance, keyTakeaways } = formData;

    if (!email || !fullName || !division || !rollNumber || !satisfaction || !relevance || !keyTakeaways) {
      return false;
    }

    // VES email validation
    if (!email.endsWith("@ves.ac.in")) {
      return false;
    }

    return true;
  };

  const saveToLocalStorage = (data) => {
    try {
      // Get existing feedback from localStorage
      const existingFeedback = localStorage.getItem('questit_feedback');
      const feedback = existingFeedback ? JSON.parse(existingFeedback) : [];

      // Add new feedback with timestamp and unique ID
      const newFeedback = {
        id: Date.now(), // Simple unique ID
        ...data,
        timestamp: new Date().toISOString(),
        submittedAt: new Date().toLocaleString(),
      };

      feedback.push(newFeedback);

      // Save back to localStorage
      localStorage.setItem('questit_feedback', JSON.stringify(feedback));

      console.log("Feedback saved to localStorage:", newFeedback);
      console.log("Total feedback:", feedback.length);

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
        message: "Please fill all required fields correctly. Email must be VES domain (@ves.ac.in).",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Save to Google Sheet via Sheety API
      const sheetResult = await saveToGoogleSheetFeedback(formData);

      if (sheetResult.success) {
        // Also save to localStorage as backup
        saveToLocalStorage(formData);

        setSubmitStatus({
          type: "success",
          message: "Feedback submitted successfully! Thank you for your valuable input.",
        });

        // Clear form
        setFormData({
          email: "",
          fullName: "",
          division: "",
          rollNumber: "",
          satisfaction: "",
          relevance: "",
          keyTakeaways: "",
          additionalComments: "",
          suggestions: "",
        });
      } else {
        // If Google Sheet fails, still save to localStorage
        const localSaved = saveToLocalStorage(formData);

        setSubmitStatus({
          type: localSaved ? "warning" : "error",
          message: localSaved
            ? "Feedback saved locally. There was an issue with our main database, but your data is secure."
            : `Failed to save feedback: ${sheetResult.error}`,
        });
      }
    } catch (error) {
      // Fallback to localStorage if API fails
      const localSaved = saveToLocalStorage(formData);

      setSubmitStatus({
        type: localSaved ? "warning" : "error",
        message: localSaved
          ? "Feedback saved locally. Please check your internet connection."
          : "Failed to save feedback. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const RadioGroup = ({ name, value, onChange, options, label, required = false }) => (
    <div>
      <label className="block text-sm font-medium text-white mb-3">
        {label} {required && "*"}
      </label>
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="sr-only"
              required={required}
            />
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-2 transition-all duration-200 ${value === option.value
                ? 'border-cyan-500 bg-cyan-500'
                : 'border-neutral-600 hover:border-cyan-400'
              }`}>
              {value === option.value && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
            <span className="text-white text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const satisfactionOptions = [
    { value: "1", label: "1 - Very Dissatisfied" },
    { value: "2", label: "2 - Dissatisfied" },
    { value: "3", label: "3 - Neutral" },
    { value: "4", label: "4 - Satisfied" },
    { value: "5", label: "5 - Very Satisfied" },
  ];

  const relevanceOptions = [
    { value: "1", label: "1 - Not Helpful" },
    { value: "2", label: "2 - Slightly Helpful" },
    { value: "3", label: "3 - Moderately Helpful" },
    { value: "4", label: "4 - Very Helpful" },
    { value: "5", label: "5 - Extremely Helpful" },
  ];

  return (
    <div className="px-4 pt-36 pb-20">
      {/* Header Section */}
      <TypewriterEffect words={words} className="pb-12" />

      <TextGenerateEffect
        words={description}
        className="bg-neutral-900 rounded-xl p-7 max-w-2xl mx-auto mb-12"
      />

      {/* Feedback Form */}
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

            {/* Satisfaction Rating */}
            <RadioGroup
              name="satisfaction"
              value={formData.satisfaction}
              onChange={handleInputChange}
              options={satisfactionOptions}
              label="How satisfied were you with today's workshop?"
              required
            />

            {/* Relevance Rating */}
            <RadioGroup
              name="relevance"
              value={formData.relevance}
              onChange={handleInputChange}
              options={relevanceOptions}
              label="How relevant and helpful do you think it was for you?"
              required
            />

            {/* Key Takeaways Field */}
            <div>
              <label htmlFor="keyTakeaways" className="block text-sm font-medium text-white mb-2">
                What were your key takeaways from the workshop? *
              </label>
              <textarea
                id="keyTakeaways"
                name="keyTakeaways"
                value={formData.keyTakeaways}
                onChange={handleInputChange}
                placeholder="Share the main things you learned or found valuable..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 resize-vertical"
                required
              />
            </div>

            {/* Additional Comments Field */}
            <div>
              <label htmlFor="additionalComments" className="block text-sm font-medium text-white mb-2">
                Any additional comments regarding today's session?
              </label>
              <textarea
                id="additionalComments"
                name="additionalComments"
                value={formData.additionalComments}
                onChange={handleInputChange}
                placeholder="Share any other thoughts about the workshop..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 resize-vertical"
              />
            </div>

            {/* Suggestions Field */}
            <div>
              <label htmlFor="suggestions" className="block text-sm font-medium text-white mb-2">
                Any suggestions for future workshops/events to be taken by Quest IT?
              </label>
              <textarea
                id="suggestions"
                name="suggestions"
                value={formData.suggestions}
                onChange={handleInputChange}
                placeholder="Suggest topics, formats, or improvements for future events..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 resize-vertical"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0px_2px_0px_0px_#FFFFFF40_inset]"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
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

export default Feedback;