import { GoogleGenerativeAI } from "@google/generative-ai";

// ⚙️ Replace this with your own Gemini API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateStartupPitch(idea, industry) {
    try {
        const prompt = `
        You are "PitchCraft" — an AI startup partner that helps founders turn ideas into powerful startup concepts.
                
        INPUT:
        Idea: ${idea}
        Industry: ${industry}
        
        TASK:
        Based on this input, generate the following as a single valid JSON object (no extra text, no markdown, no explanation):
        
        {
         "startup_name": "A short, catchy, and relevant name for the startup",
         "tagline": "A memorable and motivating tagline (under 8–10 words)",
         "pitch": "A simple but powerful paragraph describing what the startup does, what problem it solves, and why it’s unique.",
         "website": "A full, production-ready single HTML file string that includes embedded CSS and JavaScript. The website should be fully responsive, modern, and animated. It should have a hero section with the tagline, a features section, a call-to-action button, and a footer. Use visually appealing gradients, glassmorphism or neon effects, smooth transitions, and subtle animations. Include minimal JS-based interactivity (like button hover effects, animated text, or fade-ins). All animations must use CSS transitions or transform-based keyframes. The style should feel premium, futuristic, and relevant to the startup's theme.",
         "logo_idea": "A creative and visually strong logo concept that fits this startup perfectly."
        }

        
        Rules:
        - Return ONLY valid JSON.
        - Be concise but creative.
        - Use simple, human-friendly language.
        - Do not include backticks, markdown, or code formatting.
        - Do not repeat any previous one.
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Try parsing the response as JSON
        try {
            return JSON.parse(text);
        } catch (err) {
            console.warn("Gemini returned invalid JSON:", text);
            return { error: "Invalid JSON", raw: text };
        }
    } catch (error) {
        console.error("Gemini API error:", error);
        return { error: "Failed to generate pitch" };
    }
}
