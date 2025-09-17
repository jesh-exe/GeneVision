import axios from "axios";

function resolveApiUrl(): string {
  let apiUrl = (window as any)._env_?.API_URL || "http://localhost:8080";
  console.log("API Connected (raw):", apiUrl);

  // Add https:// if it's not localhost and no scheme is present
  if (
    !apiUrl.includes("localhost") &&
    !apiUrl.startsWith("http://") &&
    !apiUrl.startsWith("https://")
  ) {
    apiUrl = "https://" + apiUrl;
  }

  // Ensure exactly one `/api`
  if (!apiUrl.endsWith("/api")) {
    apiUrl = apiUrl.replace(/\/+$/, ""); // strip trailing /
    apiUrl += "/api";
  }

  return apiUrl;
}

const API_BASE_URL = resolveApiUrl();
console.log("Final API Base URL:", API_BASE_URL);

export interface GeneData {
  gene: string;
  condition: string;
  expression: number;
}

export interface GeneSearchResult {
  condition: string;
  expression: number;
}

export interface DashboardStats {
  totalGenes: number;
  totalConditions: number;
  topGenes: Array<{ gene: string; count: number }>;
}

// API client instance
const apiClient = axios.create({
  baseURL: API_BASE_URL.replace(/\/+$/, ""), // strip trailing slash
  headers: {
    "Content-Type": "application/json",
  },
});

// Upload gene expression data
export const uploadGeneData = async (data: GeneData[]): Promise<void> => {
  try {
    await apiClient.post("/upload", data);
  } catch (error) {
    console.error("Error uploading data:", error);
    throw new Error("Failed to upload gene data");
  }
};

// Search gene by name
export const searchGene = async (
  geneName: string
): Promise<GeneSearchResult[]> => {
  try {
    const response = await apiClient.get(
      `/genes/${encodeURIComponent(geneName)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching gene:", error);
    throw new Error("Failed to search gene");
  }
};

// Get all genes for dashboard
export const getAllGenes = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get("/genes");
    return response.data;
  } catch (error) {
    console.error("Error fetching genes:", error);
    throw new Error("Failed to fetch genes");
  }
};

// Get dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await apiClient.get("/dashboard/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error("Failed to fetch dashboard statistics");
  }
};
