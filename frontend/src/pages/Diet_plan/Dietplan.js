import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import Notice from "../../component/notice";
import html2canvas from "html2canvas";
import { Link } from "react-router-dom";

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

const Dietplan = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [dietPlan, setDietPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNotice, setShowNotice] = useState(true);

  useEffect(() => {
    setShowNotice(true); // Show notice when the page loads
  }, []);

  const generateDietPlan = async () => {
    if (!apiKey) {
      console.error("⚠️ API Key is missing!");
      setDietPlan("⚠️ API Key is missing. Check your .env file.");
      return;
    }

    if (!weight || !height) {
      setDietPlan("⚠️ Please enter both weight and height.");
      return;
    }

    setLoading(true);
    setDietPlan(""); // Clear old results

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `
        Generate a personalized gym diet plan for an athlete with the following details:
        - Weight: ${weight} kg
        - Height: ${height} cm
        - The diet should include meal options for breakfast, lunch, dinner, and snacks.
        - Include protein intake recommendations and calorie intake.
        - Provide portion sizes and meal timings.
        - give instructions point by point.
        - make more simple easy to read.
      `;

      const response = await model.generateContent(prompt);
      const text =
        response?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response";

      setDietPlan(text);
    } catch (error) {
      console.error("Error generating diet plan:", error);
      setDietPlan("⚠️ Failed to generate a diet plan. Please try again.");
    }
    setLoading(false);
  };

  const downloadPDF = () => {
  const pdf = new jsPDF();

  const marginLeft = 15;
  const marginTop = 50; // Leave space for the header
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const lineHeight = 10;

  // ====== HEADER START ======
  // Header background
  pdf.setDrawColor(100, 100, 255);
  pdf.setFillColor(245, 245, 255);
  pdf.rect(0, 0, pageWidth, 40, 'F');

  // Gym Name
  pdf.setFontSize(16);
  pdf.setTextColor(60, 60, 200);
  pdf.setFont('helvetica', 'bold');
  pdf.text('REAL FITNESS CENTER', marginLeft, 15);

  // Address and contact
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.setFont('helvetica', 'normal');
  pdf.text('No-29/1/1, Light House Road, Dondra', marginLeft, 22);
  pdf.text('Phone: 0763356041 | Email: realfitnesscenter@gmail.com', marginLeft, 28);

  // Report Title
  pdf.setFontSize(14);
  pdf.setTextColor(40, 40, 40);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DIET PLAN REPORT', pageWidth - marginLeft, 15, { align: 'right' });
  // ====== HEADER END ======

  // Process the diet plan text
  const text = dietPlan.replace(/#/g, "").replace(/\*/g, "");
  const lines = pdf.splitTextToSize(text, pageWidth - 2 * marginLeft);

  let y = marginTop;
  lines.forEach((line) => {
    if (y + lineHeight > pageHeight - 10) {
      pdf.addPage();

      // Re-draw header on new page
      pdf.setDrawColor(100, 100, 255);
      pdf.setFillColor(245, 245, 255);
      pdf.rect(0, 0, pageWidth, 40, 'F');

      pdf.setFontSize(16);
      pdf.setTextColor(60, 60, 200);
      pdf.setFont('helvetica', 'bold');
      pdf.text('REAL FITNESS CENTER', marginLeft, 15);

      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      pdf.text('No-29/1/1, Light House Road, Dondra', marginLeft, 22);
      pdf.text('Phone: 0763356041 | Email: realfitnesscenter@gmail.com', marginLeft, 28);

      pdf.setFontSize(14);
      pdf.setTextColor(40, 40, 40);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DIET PLAN REPORT', pageWidth - marginLeft, 15, { align: 'right' });

      y = marginTop;
    }

    pdf.text(line, marginLeft, y);
    y += lineHeight;
  });

  pdf.save("Diet_Plan.pdf");
};


  // Simple loading spinner
  const Loader = () => (
    <div className="flex justify-center mt-4">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-120px)] p-10">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
        {showNotice && <Notice onClose={() => setShowNotice(false)} />}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Diet Plan Generator
        </h2>

        {/* Weight Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">
            Weight (kg):
          </label>
          <input
            type="number"
            min="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter your weight"
          />
        </div>

        {/* Height Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">
            Height (cm):
          </label>
          <input
            type="number"
            min="0"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter your height"
          />
        </div>

        {/* Generate Button */}
        <button
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200 ease-in-out"
          onClick={generateDietPlan}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Diet Plan"}
        </button>

        {/* Diet Plan Output */}
        <div
          id="diet-plan-output"
          className="mt-6 p-4 bg-gray-100 rounded-md text-gray-800 min-h-[100px]"
        >
          {loading ? (
            <Loader />
          ) : dietPlan ? (
            <div
              dangerouslySetInnerHTML={{
                __html: dietPlan
                  .replace(/#/g, "")
                  .replace(/\*/g, "")
                  .replace(/\n/g, "<br>"),
              }}
            />
          ) : (
            "Your generated diet plan will appear here."
          )}
        </div>

        {/* Download PDF Button */}
        {dietPlan && !loading && (
          <button
            className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition duration-200 ease-in-out"
            onClick={downloadPDF}
          >
            Download PDF
          </button>
        )}
      </div>
    </div>
  );
};

export default Dietplan;
