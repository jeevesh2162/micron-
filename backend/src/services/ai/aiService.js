// backend/src/services/ai/aiService.js
// Deterministic scoring service for inspection AI predictions.
// Computes scores from Gemini output, applies weights, and suggests status.

/**
 * Compute damage detection score based on result and severity.
 * @param {string} result - 'NOT_DAMAGED', 'DAMAGED', or 'UNCERTAIN'.
 * @param {string} severity - 'LOW', 'MEDIUM', 'HIGH', or 'UNCERTAIN' (when result is DAMAGED).
 * @returns {number} score (0-100).
 */
function damageScore(result, severity) {
  if (result === 'NOT_DAMAGED') return 0;
  if (result === 'DAMAGED') {
    switch (severity) {
      case 'LOW':
        return 40;
      case 'MEDIUM':
        return 70;
      case 'HIGH':
        return 100;
      case 'UNCERTAIN':
        return 50;
      default:
        return 50;
    }
  }
  // UNCERTAIN or any other value
  return 50;
}

/**
 * Compute consistency score for material validation or reason consistency.
 * @param {string} result - 'CONSISTENT', 'INCONSISTENT', or 'UNCERTAIN'.
 * @returns {number} score (0-100).
 */
function consistencyScore(result) {
  if (result === 'CONSISTENT') return 0;
  if (result === 'INCONSISTENT') return 100;
  return 50; // UNCERTAIN or unknown
}

/**
 * Calculate deterministic prediction object from Gemini raw result.
 * @param {Object} geminiResult - Parsed Gemini JSON with fields
 *   damageDetection, materialValidation, reasonConsistency.
 * @returns {Object} prediction matching the InspectionRequest.aiPrediction schema.
 */
function calculatePrediction(geminiResult) {
  if (!geminiResult) return null;
  const { damageDetection, materialValidation, reasonConsistency } = geminiResult;

  const damageDetectionScore = damageScore(damageDetection?.result, damageDetection?.severity);
  const materialValidationScore = consistencyScore(materialValidation?.result);
  const reasonConsistencyScore = consistencyScore(reasonConsistency?.result);

  const weights = {
    damageDetection: 0.5,
    materialValidation: 0.3,
    reasonConsistency: 0.2,
  };

  const overallScore =
    damageDetectionScore * weights.damageDetection +
    materialValidationScore * weights.materialValidation +
    reasonConsistencyScore * weights.reasonConsistency;

  let suggestedStatus = 'NORMAL';
  if (overallScore >= 60) {
    suggestedStatus = 'SCRAP';
  } else if (overallScore >= 30) {
    suggestedStatus = 'REUSABLE';
  }

  return {
    // raw Gemini fields (preserved)
    damageDetection,
    materialValidation,
    reasonConsistency,
    // computed scores
    damageDetectionScore,
    materialValidationScore,
    reasonConsistencyScore,
    weights,
    overallScore: Math.round(overallScore),
    suggestedStatus,
    overallExplanation: `Overall score ${overallScore.toFixed(1)} leads to suggested status ${suggestedStatus}.`,
  };
}

module.exports = { calculatePrediction };
