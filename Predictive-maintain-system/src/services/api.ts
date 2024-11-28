import axios from "axios";

const API_BASE = "http://localhost:5000";

export const fetchPredictions = async (data: any) => {
  const response = await axios.post(`${API_BASE}/predict`, { features: data });
  return response.data;
};

export const fetchContributions = async (inputData: { [key: string]: any }) => {
  const inputDataFiltered = Object.keys(inputData)
    .filter((key: string) =>
      [
        "vibration_01",
        "vibration_02",
        "vibration_03",
        "temperature",
        "rpm_1",
        "Failure_Type",
      ].includes(key)
    )
    .reduce((obj: any, key: string) => {
      obj[key] = inputData[key];
      return obj;
    }, {});
  inputDataFiltered["vibration_01"] = parseFloat(
    inputDataFiltered["vibration_01"]
  );
  inputDataFiltered["vibration_02"] = parseFloat(
    inputDataFiltered["vibration_02"]
  );
  inputDataFiltered["vibration_03"] = parseFloat(
    inputDataFiltered["vibration_03"]
  );
  inputDataFiltered["temperature"] = parseFloat(
    inputDataFiltered["temperature"]
  );
  inputDataFiltered["rpm_1"] = parseFloat(inputDataFiltered["rpm_1"]);
  inputDataFiltered["Failure_Type"] = parseInt(
    inputDataFiltered["Failure_Type"]
  );

  const response = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inputDataFiltered),
  });
  const data = await response.json();
  return data;
};

export const fetchCorrelations = async (data: any) => {
  const response = await axios.post(`${API_BASE}/correlations`, {
    features: data,
  });
  return response.data;
};

export const fetchCorrelationMatrix = async () => {
  const response = await axios.get(`${API_BASE}/correlation_matrix`);
  return response.data;
};
