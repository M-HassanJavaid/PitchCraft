import { useState, useEffect , useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { generateStartupPitch } from "../functions/generatePitch";
import Loader from "./Loader";
import app from "../config/firebase";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { AuthContext } from "../Context/authContext";


const db = getFirestore(app);
const auth = getAuth(app);

import savePitch from "../functions/savePitchToDb";

const PromptInput = () => {
  const {user} = useContext(AuthContext);
  const [input, setInput] = useState({ idea: "", industry: "" });
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  // Monitor auth state - redirect if not logged in

  function handleChange(e) {
    let newInput = JSON.parse(JSON.stringify(input));
    setInput({ ...newInput, [e.target.name]: e.target.value });
  }

  async function generatePitch() {
    try {
      setIsGenerating(true);

      if (!input.idea || !input.industry) {
        return alert("Field cannot be empty!");
      }


      let data = await generateStartupPitch(input.idea, input.industry);
      console.log("Generated data:", data);


      if (!user || !user.email) {
        throw new Error("User not authenticated");
      }

      let id = await savePitch(data , user.email);

      console.log("✅ Idea saved to Firebase!");
      alert("🎉 Startup pitch generated & saved! Redirecting to dashboard...");

      // ✅ REDIRECT TO DASHBOARD
      navigate(`/startup/${id}`);

    } catch (error) {
      console.error("Error:", error);
      alert(`Oops! ${error.message}`);
    } finally {
      setInput({ idea: "", industry: "" });
      setIsGenerating(false);
    }
  }

  // Show loader during generation
  if (isGenerating) {
    return <Loader />;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-lg bg-black text-white rounded-2xl shadow-2xl shadow-amber-500 p-8 glass border-2 border-white border-4">
        <h1 className="text-3xl font-semibold text-center mb-6">
          PitchCraft – AI Startup Partner
        </h1>
        <p className="text-center text-white/70 mb-6">
          Welcome back, {user.displayName || user.email}!
        </p>

        <form className="space-y-5">
          <div>
            <label className="block text-sm mb-2">Your Startup Idea</label>
            <textarea
              onChange={handleChange}
              name="idea"
              value={input.idea}
              placeholder="Describe your startup idea..."
              rows="4"
              className="w-full px-4 py-2 rounded-lg bg-neutral-900 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm mb-2">Industry</label>
            <input
              onChange={handleChange}
              name="industry"
              value={input.industry}
              type="text"
              placeholder="e.g., HealthTech, FinTech, EdTech"
              className="w-full px-4 py-2 rounded-lg bg-neutral-900 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            onClick={generatePitch}
            type="button"
            disabled={!input.idea || !input.industry}
            className="w-full py-2 mt-4 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-all duration-300 disabled:bg-amber-300 disabled:cursor-not-allowed"
          >
            ✨ Generate & Save Pitch
          </button>
        </form>

        <p className="text-center text-xs text-white/50 mt-4">
          Your idea will be saved securely and viewable in Dashboard
        </p>
      </div>
    </div>
  );
};

export default PromptInput;