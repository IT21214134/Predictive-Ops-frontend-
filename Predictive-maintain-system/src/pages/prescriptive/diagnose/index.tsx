"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Alert,
  CircularProgress,
  Fade,
  Divider,
  alpha,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { API_CONFIG } from "@/config/api";

type RecommendationItem = {
  reason: string;
  solution: string;
};
import { useRouter } from "next/navigation";
import axios from "axios";
import React from "react";

export default function Diagnose() {
  const [formData, setFormData] = useState({
    temperature: "",
    vibration: "",
    vibration2: "",
    vibration3: "",
    noise: null,
    alignment: null,
    overheating: null,
    type: null,
  });

  const router = useRouter();
  const [result, setResult] = useState(null);
  const [nextQuestion, setNextQuestion] = useState(null);
  const [recommendation, setRecommendation] = useState<RecommendationItem[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setNextQuestion(null);
    setRecommendation([]);

    try {
      const response = await axios.post(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.diagnose}`,
        formData
      );
      setResult(response.data.criticality);
      setNextQuestion(response.data.next_question);
      setRecommendation(response.data.recommendation[0].details);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Something went wrong!");
      } else {
        setError("Something went wrong!");
      }
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("failureData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setFormData({
        temperature: parsedData.temperature || "",
        vibration: parsedData.vibration_01 || "",
        vibration2: parsedData.vibration_02 || "",
        vibration3: parsedData.vibration_03 || "",
        noise: null,
        alignment: null,
        overheating: null,
        type: parsedData.Failure_Type_Name,
      });
    }
  }, []);

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: 700,
            color: "text.primary",
            textAlign: "center",
          }}
        >
          Machine Diagnostic Dashboard
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr" },
            gap: 4,
          }}
        >
          {/* Input Form Section */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                boxShadow: (theme) =>
                  `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
              },
            }}
          >
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
              Sensor Readings
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "grid", gap: 3 }}
            >
              {/* Temperature Input */}
              <TextField
                fullWidth
                label="Temperature (°C)"
                name="temperature"
                type="number"
                value={parseFloat(formData.temperature).toFixed(2)}
                onChange={handleInputChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />

              {/* Vibration Inputs */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 2,
                }}
              >
                {(
                  [
                    { name: "vibration", label: "Vibration 01" },
                    { name: "vibration2", label: "Vibration 02" },
                    { name: "vibration3", label: "Vibration 03" },
                  ] as const
                ).map((field) => (
                  <TextField
                    key={field.name}
                    label={`${field.label} Reading`}
                    name={field.name}
                    type="number"
                    value={parseFloat(formData[field.name]).toFixed(2)}
                    onChange={handleInputChange}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />
                ))}
              </Box>

              {/* Radio Options */}
              {(
                [
                  {
                    name: "noise",
                    label: "Noise Detection",
                    options: ["yes", "no"],
                  },
                  {
                    name: "alignment",
                    label: "Alignment Status",
                    options: ["aligned", "misaligned"],
                  },
                  {
                    name: "overheating",
                    label: "Overheating Status",
                    options: ["yes", "no"],
                  },
                ] as const
              ).map((field) => (
                <Box key={field.name} sx={{ mt: 2 }}>
                  <Typography sx={{ mb: 1, fontWeight: 500 }}>
                    {field.label}
                  </Typography>
                  <RadioGroup
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleRadioChange}
                    row
                    sx={{ gap: 4 }}
                  >
                    {field.options.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio />}
                        label={option.charAt(0).toUpperCase() + option.slice(1)}
                        sx={{
                          "& .MuiRadio-root": {
                            color: "primary.main",
                          },
                        }}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              ))}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 4,
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                    bgcolor: "primary.dark",
                  },
                }}
              >
                Run Diagnostic Analysis
              </Button>
            </Box>
          </Paper>

          {/* Results Section */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                boxShadow: (theme) =>
                  `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
              },
            }}
          >
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
              Diagnostic Results
            </Typography>

            {error && (
              <Fade in>
                <Alert
                  severity={
                    error === "No suggestions found!" ? "info" : "error"
                  }
                  sx={{ mb: 3 }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {result ? (
              <Fade in>
                <Box sx={{ display: "grid", gap: 3 }}>
                  <Paper
                    sx={{
                      p: 3,
                      bgcolor: alpha("#1976d2", 0.08),
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      Criticality Level
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {typeof result === "object"
                        ? JSON.stringify(result, null, 2)
                        : result}
                    </Typography>
                  </Paper>

                  {nextQuestion && (
                    <Paper
                      sx={{
                        p: 3,
                        bgcolor: alpha("#ed6c02", 0.08),
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        Follow-up Analysis
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        {typeof nextQuestion === "object"
                          ? JSON.stringify(nextQuestion, null, 2)
                          : nextQuestion}
                      </Typography>
                    </Paper>
                  )}

                  {recommendation && Array.isArray(recommendation) && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Recommended Actions
                      </Typography>
                      <Box sx={{ display: "grid", gap: 2 }}>
                        {recommendation.map((item, index) => (
                          <Paper
                            key={index}
                            sx={{
                              p: 3,
                              bgcolor: alpha("#2e7d32", 0.08),
                              borderRadius: 2,
                              transition: "transform 0.2s ease-in-out",
                              "&:hover": {
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                color: "success.dark",
                                mb: 1,
                              }}
                            >
                              Issue:
                            </Typography>
                            <Typography paragraph>{item.reason}</Typography>
                            <Divider sx={{ my: 1.5 }} />
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                color: "success.dark",
                                mb: 1,
                              }}
                            >
                              Solution:
                            </Typography>
                            <Typography>{item.solution}</Typography>
                          </Paper>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Fade>
            ) : (
              <Box
                sx={{
                  p: 4,
                  textAlign: "center",
                  color: "text.secondary",
                }}
              >
                <SettingsIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography>
                  No diagnostic results available. Please run the analysis to
                  see results.
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
