"use client";
import ContributionsChart from "@/components/prescriptive/ContributionsChart";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Diagnose from "../diagnose/index";
import FailureDetails from "@/components/prescriptive/FailureDetails";
import {
  Box,
  Tab,
  Tabs,
  Paper,
  Typography,
  Alert,
  Container,
  CircularProgress,
  Button,
  Fade,
  Breadcrumbs,
  Link,
  Divider,
  alpha,
} from "@mui/material";
import { Timeline, Warning, ArrowBack, Assessment } from "@mui/icons-material";
import Swal from "sweetalert2";
import { fetchContributions } from "@/services/api";
import PrescriptiveLayout from "../layout";
import router from "next/router";
import {
  Build as DiagnoseIcon,
  Analytics as AnalyticsIcon,
} from "@mui/icons-material";

interface Contributions {
  [feature: string]: number[];
}

interface ContributionData {
  contributions: Contributions;
  contributions_percent: any;
}

export default function AnalyzeFailurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const data = searchParams?.get("data");
  const [activeTab, setActiveTab] = useState(0);

  const failureDataPassed = React.useMemo(() => {
    if (data) {
      try {
        return JSON.parse(decodeURIComponent(data as string));
      } catch (error) {
        console.error("Failed to parse failure data:", error);
        return null;
      }
    }
    return null;
  }, [data]);

  // Error state component
  const ErrorState = () => (
    <PrescriptiveLayout>
      <Container maxWidth="md" sx={{ textAlign: "center", py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: "1px solid",
            borderColor: "error.light",
            bgcolor: alpha("#ff0000", 0.02),
          }}
        >
          <Warning color="error" sx={{ fontSize: 48, mb: 2 }} />
          <Alert severity="error" sx={{ mb: 3 }}>
            Error: Invalid or missing failure data.
          </Alert>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBack />}
            onClick={() => router.push("/")}
            sx={{
              textTransform: "none",
              boxShadow: "none",
            }}
          >
            Return to Dashboard
          </Button>
        </Paper>
      </Container>
    </PrescriptiveLayout>
  );

  const [possibleCauses, setPossibleCauses] = useState<string[]>([]);
  const [solutions, setSolutions] = useState<string[]>([]);
  const [contributionData, setContributionData] =
    useState<ContributionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const failureCausesData: Record<
    string,
    { causes: string[]; solutions: string[] }
  > = {};

  useEffect(() => {
    const failureData = failureCausesData[failureDataPassed.Failure_Type_Name];
    if (failureData) {
      setPossibleCauses(failureData.causes);
      setSolutions(failureData.solutions);
    } else {
      setPossibleCauses(["No preventive measures for this failure type."]);
      setSolutions(["No solutions available for this failure type."]);
    }
  }, [failureDataPassed]);

  useEffect(() => {
    if (failureDataPassed) {
      // setLoading(true);
      // Swal.fire({
      //   title: "Loading contributions...",
      //   allowOutsideClick: false,
      //   didOpen: () => {
      //     Swal.showLoading();
      //   },
      // });

      fetchContributions(failureDataPassed)
        .then((response) => {
          if (!response || typeof response !== "object") {
            throw new Error("Invalid response format");
          }
          setContributionData(response);
        })
        .catch((error) => {
          console.error("Error fetching contributions:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [failureDataPassed]);

  if (!failureDataPassed) return <ErrorState />;

  return (
    <PrescriptiveLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            href="/"
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
          >
            Dashboard
          </Link>
          <Typography color="text.primary">Failure Analysis</Typography>
        </Breadcrumbs>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Failure Analysis
          </Typography>
          <Typography color="text.secondary" variant="subtitle1">
            Detailed analysis and recommendations for the detected failure
          </Typography>
        </Box>

        {/* <Fade in={!loading}> */}
        {/* <Box>
            {contributionData && (
              <Fade in timeout={600}>
                <Paper
                  elevation={2}
                  sx={{
                    p: { xs: 2, md: 4 },
                    mb: 4,
                    borderRadius: 3,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    maxWidth: 1000,
                    mx: "auto",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Feature Contributions
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Visual breakdown of how each sensor and measurement
                    contributed to this failure prediction.
                  </Typography>
                  <Box sx={{ width: "100%", mb: 3 }}>
                    <ContributionsChart
                      contributions_percent={
                        contributionData.contributions_percent
                      }
                    />
                  </Box>
                </Paper>
              </Fade>
            )}*/}
        <Fade in={!loading}>
          <Box>
            <Paper elevation={0} variant="outlined" sx={{ p: 4, mb: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Assessment color="primary" />
                  Failure Type: {failureDataPassed.Failure_Type_Name}
                </Typography>
                <Divider sx={{ my: 2 }} />
              </Box>

              <Typography variant="body1" paragraph>
                Below is an analysis of the possible causes and solutions for
                the failure type:{" "}
                <strong>{failureDataPassed.Failure_Type_Name}</strong>.
              </Typography>

              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Timeline color="primary" />
                  Preventive Measures:
                </Typography>
                <Box sx={{ pl: 2 }}>
                  {possibleCauses.map((cause, index) => (
                    <Typography
                      key={index}
                      variant="body1"
                      sx={{
                        py: 1,
                        display: "flex",
                        alignItems: "center",
                        "&:before": {
                          content: '"•"',
                          color: "primary.main",
                          mr: 2,
                          fontWeight: "bold",
                        },
                      }}
                    >
                      {cause}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Fade>

        {loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              gap: 2,
            }}
          >
            <CircularProgress />
            <Typography color="text.secondary">
              Analyzing failure data...
            </Typography>
          </Box>
        )}

        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            mt: 4,
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: alpha("#f5f5f5", 0.5),
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
            variant="fullWidth"
          >
            <Tab
              icon={<DiagnoseIcon />}
              iconPosition="start"
              label="Diagnose Predicted Failure"
              sx={{
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 500,
                py: 2,
                "&.Mui-selected": {
                  color: "primary.main",
                  fontWeight: 600,
                },
                "&:hover": {
                  bgcolor: alpha("#000", 0.02),
                },
              }}
            />
            <Tab
              icon={<AnalyticsIcon />}
              iconPosition="start"
              label="General Failure Analysis"
              sx={{
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 500,
                py: 2,
                "&.Mui-selected": {
                  color: "primary.main",
                  fontWeight: 600,
                },
                "&:hover": {
                  bgcolor: alpha("#000", 0.02),
                },
              }}
            />
          </Tabs>

          <Fade in timeout={300}>
            <Box
              sx={{
                p: 3,
                bgcolor: "background.paper",
                minHeight: 400,
                position: "relative",
              }}
            >
              {activeTab === 0 ? (
                <Box role="tabpanel">
                  <Diagnose />
                </Box>
              ) : (
                <Box role="tabpanel">
                  <FailureDetails />
                </Box>
              )}
            </Box>
          </Fade>
        </Paper>
      </Container>
    </PrescriptiveLayout>
  );
}

// Error state should also use the layout
const ErrorState = () => (
  <PrescriptiveLayout>
    <Container maxWidth="md" sx={{ textAlign: "center", py: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: "1px solid",
          borderColor: "error.light",
          bgcolor: alpha("#ff0000", 0.02),
        }}
      >
        <Warning color="error" sx={{ fontSize: 48, mb: 2 }} />
        <Alert severity="error" sx={{ mb: 3 }}>
          Error: Invalid or missing failure data.
        </Alert>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBack />}
          onClick={() => router.push("/prescriptive/dashboard")}
          sx={{
            textTransform: "none",
            boxShadow: "none",
          }}
        >
          Return to Dashboard
        </Button>
      </Paper>
    </Container>
  </PrescriptiveLayout>
);
