import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  SelectChangeEvent,
  Paper,
  Fade,
  Grow,
  IconButton,
  Tooltip,
  alpha,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircleOutline,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { API_CONFIG } from "@/config/api";

interface Detail {
  reason: string;
  solution: string;
  tags?: string[];
}

interface FailureData {
  _id: string;
  details: Detail[];
  failure: string;
}

const FailureDetails: React.FC = () => {
  const [failureData, setFailureData] = useState<FailureData[]>([]);
  const [selectedFailure, setSelectedFailure] = useState<string>("");
  const [showReasons, setShowReasons] = useState<boolean>(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFailureData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.instructions}`
        );
        setFailureData(response.data.instructions);
      } catch (error) {
        console.error("Error fetching failure data:", error);
        setError("Failed to fetch failure data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFailureData();
  }, []);

  useEffect(() => {
    if (failureData.length > 0 && !selectedFailure) {
      setSelectedFailure(failureData[0].failure);
    }
  }, [failureData]);

  const handleFailureChange = (event: SelectChangeEvent<string>) => {
    setSelectedFailure(event.target.value as string);
    setShowReasons(false);
    setExpandedIndex(null);
    setSelectedTags([]);
  };

  const handleShowReasons = () => {
    setShowReasons(true);
  };

  const toggleSolutionVisibility = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleTagChange = (tag: string) => {
    setShowReasons(false);
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const currentFailure = failureData.find(
    (item) => item.failure === selectedFailure
  );
  const currentDetails = currentFailure?.details || [];
  const allTags = Array.from(
    new Set(
      failureData.flatMap((failureItem) =>
        failureItem.details.flatMap((detail) => detail.tags || [])
      )
    )
  );
  const filteredDetails = selectedTags.length
    ? currentDetails.filter((detail) =>
        detail.tags?.some((tag) => selectedTags.includes(tag))
      )
    : currentDetails;

  return (
    <Box sx={{ p: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: "text.primary",
            borderBottom: "2px solid",
            borderColor: "primary.main",
            pb: 2,
            textAlign: "center",
          }}
        >
          General Failure Diagnostics
        </Typography>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            action={
              <IconButton
                color="inherit"
                size="small"
                onClick={() => window.location.reload()}
              >
                <RefreshIcon />
              </IconButton>
            }
          >
            {error}
          </Alert>
        ) : (
          <Fade in>
            <FormControl fullWidth>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Select the Failure Type :
              </Typography>
              <Select
                value={selectedFailure}
                onChange={handleFailureChange}
                sx={{
                  "& .MuiSelect-select": {
                    py: 1.5,
                  },
                }}
              >
                {failureData.map((failureItem) => (
                  <MenuItem key={failureItem._id} value={failureItem.failure}>
                    {failureItem.failure}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Fade>
        )}
      </Paper>

      {allTags.length > 0 && (
        <Grow in>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: "text.primary",
                borderBottom: "1px solid",
                borderColor: "divider",
                pb: 1,
              }}
            >
              Observations
            </Typography>
            {allTags.map((tag) => (
              <Box
                key={tag}
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: alpha("#f5f5f5", 0.5),
                  borderRadius: 1,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor: alpha("#f5f5f5", 0.8),
                  },
                }}
              >
                <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 500 }}>
                  Is there any {tag.toLowerCase()} experiencing with the
                  machine?
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  {["Yes", "No"].map((option) => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          checked={
                            option === "Yes"
                              ? selectedTags.includes(tag)
                              : !selectedTags.includes(tag)
                          }
                          onChange={() => handleTagChange(tag)}
                          icon={<ErrorIcon color="action" />}
                          checkedIcon={<CheckCircleOutline color="primary" />}
                        />
                      }
                      label={option}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Paper>
        </Grow>
      )}

      <Button
        variant="contained"
        onClick={handleShowReasons}
        sx={{
          py: 1.5,
          px: 4,
          mb: 4,
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
            bgcolor: "primary.dark",
          },
        }}
        fullWidth
      >
        Analyze Issues
      </Button>

      {showReasons && (
        <Fade in>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: "text.primary",
                borderBottom: "1px solid",
                borderColor: "divider",
                pb: 1,
              }}
            >
              Possible Reasons
            </Typography>

            {filteredDetails.length > 0 ? (
              filteredDetails.map((detail, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 2,
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 2,
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      onClick={() => toggleSolutionVisibility(index)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {detail.reason}
                      </Typography>
                      <IconButton size="small">
                        <ExpandMoreIcon
                          sx={{
                            transform:
                              expandedIndex === index
                                ? "rotate(180deg)"
                                : "none",
                            transition: "transform 0.2s",
                          }}
                        />
                      </IconButton>
                    </Box>

                    <Fade in={expandedIndex === index}>
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          bgcolor: alpha("#e3f2fd", 0.5),
                          borderRadius: 1,
                          display: expandedIndex === index ? "block" : "none",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          <strong>Solution: </strong>
                          {detail.solution}
                        </Typography>
                      </Box>
                    </Fade>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Alert severity="info">
                No details match the selected criteria.
              </Alert>
            )}
          </Paper>
        </Fade>
      )}
    </Box>
  );
};

export default FailureDetails;
