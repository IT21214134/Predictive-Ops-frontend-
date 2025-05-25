import { API_CONFIG } from "@/config/api";

export interface DataPoint {
  vibration_1: number;
  vibration_2: number;
  vibration_3: number;
  temperature: number;
  rpm_1: number;
  Target: number;
  Failure_Flag: number;
  Failure_Type_Name: string;
}

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
}

export async function loadData(): Promise<DataPoint[]> {
  const url = new URL("/api/data", window.location.origin);
  const response = await fetch(url.toString());
  const { data } = await response.json();
  return data;
}

export async function loadMetrics(): Promise<ModelMetrics> {
  if (!API_CONFIG.baseUrl) {
    throw new Error("API base URL is not configured");
  }
  const url = new URL(API_CONFIG.endpoints.metrics, API_CONFIG.baseUrl);
  const response = await fetch(url.toString());
  const { metrics } = await response.json();
  return {
    accuracy: metrics.accuracy,
    precision: metrics.precision,
    recall: metrics.recall,
    f1_score: metrics.f1_score,
  };
}

// Initialize with empty data that will be populated when component mounts
export const mockData = {
  data: [] as DataPoint[],
  performance: {
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1_score: 0,
  } as ModelMetrics,
};
