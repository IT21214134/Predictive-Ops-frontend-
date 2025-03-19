"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Box, Tab, Tabs, Paper, Typography, Alert, Container, CircularProgress, Button } from "@mui/material";
import Swal from "sweetalert2";
import { fetchContributions } from "@/services/api";
import ContributionsChart from "@/components/prescriptive/ContributionsChart";
import Diagnose from "../diagnose";
import FailureDetails from "@/components/prescriptive/FailureDetails";

interface Contributions {
  [feature: string]: number[];
}

interface ContributionData {
  contributions: Contributions;
}

export default function AnalyzeFailurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const data = searchParams.get("data");
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

  if (!failureDataPassed) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
        <Alert severity="error">Error: Invalid or missing failure data.</Alert>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => router.push("/")}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  const [possibleCauses, setPossibleCauses] = useState<string[]>([]);
  const [solutions, setSolutions] = useState<string[]>([]);
  const [contributionData, setContributionData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const failureCausesData: Record<string, { causes: string[]; solutions: string[] }> = {};

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
      setLoading(true);
      Swal.fire({
        title: "Loading contributions...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      fetchContributions(failureDataPassed)
        .then((response) => {
          setContributionData(response);
          Swal.close();
        })
        .catch((error) => {
          console.error("Error fetching contributions:", error);
          // Swal.fire({
          //   icon: "error",
          //   title: "Oops...",
          //   text: "Failed to fetch contributions data!",
          // });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [failureDataPassed]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Failure Analysis
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {contributionData && (
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <ContributionsChart contributions={contributionData?.contributions} />
            </Box>
          )}

            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Failure Type: {failureDataPassed.Failure_Type_Name}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom></Typography>
              Below is an analysis of the possible causes and solutions for the failure type: <strong>{failureDataPassed.Failure_Type_Name}</strong>.
            </Paper>
        </>)}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Possible Causes:
      </Typography>
      <ul>
        {possibleCauses.map((cause, index) => (
          <li key={index}>
            <Typography variant="body1">{cause}</Typography>
          </li>
        ))}
      </ul>
    <Box sx={{ width: "100%" }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Diagnose Predicted Failure" />
          <Tab label="General Failure Analysis" />
        </Tabs>

        <Box>
          {activeTab === 0 ? <Diagnose /> : <FailureDetails />}
        </Box>
      </Box>
    </Container>
  );
}
