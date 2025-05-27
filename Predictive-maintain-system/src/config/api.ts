export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  endpoints: {
    metrics: "/metrics/model_metrics",
    data: "/api/data",
    instructions: "/instructions",
    diagnose: "/diagnostics/diagnose",
    featureImportance: "/model/feature-importance",
    analyze: "/analytics/analize",
    failureAnalysis: "/analytics/analyze",
    correlations: "/correlations",
    correlationMatrix: "/correlation_matrix",
  },
};
