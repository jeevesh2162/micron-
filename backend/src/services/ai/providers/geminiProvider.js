const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const geminiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

if (!geminiKey) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(geminiKey);
const model = genAI.getGenerativeModel({ model: geminiModel });

/**
 * Analyze an inspection using Gemini Vision.
 * @param {Object} params
 * @param {string} params.itemId
 * @param {string} params.itemType
 * @param {string} params.description
 * @param {string} params.defectDescription
 * @param {string} params.imagePath - absolute path to the uploaded image file
 * @returns {Promise<Object>} structured Gemini output matching the required schema
 */
async function analyzeInspection({ itemId, itemType, description, defectDescription, imagePath }) {
  // Build the prompt with required context
  const systemPrompt = `You are an inspection assistant. Evaluate a defect photo against the provided item context.
  Return a JSON object with the following structure exactly:
  {
    "damageDetection": {
      "result": "DAMAGED" | "NOT_DAMAGED" | "UNCERTAIN",
      "severity": "LOW" | "MEDIUM" | "HIGH" | "UNCERTAIN",
      "confidence": number (0-1),
      "explanation": string
    },
    "materialValidation": {
      "result": "CONSISTENT" | "INCONSISTENT" | "UNCERTAIN",
      "confidence": number (0-1),
      "explanation": string
    },
    "reasonConsistency": {
      "result": "CONSISTENT" | "INCONSISTENT" | "UNCERTAIN",
      "confidence": number (0-1),
      "explanation": string
    }
  }
  Do NOT mention inventory numbers or suggest any status. Only provide the observations.
  `;

  const parts = [
    { text: systemPrompt },
    { text: `Item ID: ${itemId}\nItem Type: ${itemType}\nDescription: ${description}\nDefect Description (as reported by employee): ${defectDescription}` },
    { fileData: { mimeType: 'image/jpeg', data: require('fs').readFileSync(imagePath) } },
  ];

  const result = await model.generateContent(parts);
  const responseText = result.response.text();
  try {
    return JSON.parse(responseText);
  } catch (e) {
    // If Gemini returns something unparsable, wrap in a friendly error
    const err = new Error('Failed to parse Gemini response as JSON');
    err.original = responseText;
    throw err;
  }
}

module.exports = { analyzeInspection };
