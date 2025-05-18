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
} from "@mui/material";

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

  useEffect(() => {
    const fetchFailureData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5001/instructions/");
        setFailureData(response.data.instructions);
      } catch (error) {
        console.error("Error fetching failure data:", error);
        alert("Failed to fetch failure data. Please try again later.");
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
    <div className="p-8 w-full bg-gray-50 min-h-screen">
      <Card className="mb-8 p-6 shadow-lg bg-white">
        <Typography variant="h4" className="font-bold text-gray-800 mb-6 border-b pb-4">
          General Failure Diagnostics
        </Typography>

      <FormControl fullWidth className="mb-6">
        <InputLabel id="failure-select-label" className="font-medium">Select a Failure Type</InputLabel>
        <Select
          labelId="failure-select-label"
          id="failure-select"
          value={selectedFailure}
          onChange={handleFailureChange}
        >
          {failureData.map((failureItem) => (
            <MenuItem key={failureItem._id} value={failureItem.failure}>
              {failureItem.failure}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      </Card>

      {allTags.length > 0 && (
        <Card className="mb-8 p-6 shadow-lg bg-white">
          <Typography variant="h6" className="font-semibold text-gray-700 mb-4 border-b pb-3">
            Observations
          </Typography>
          {allTags.map((tag) => (
            <Box key={tag} className="mb-6 bg-gray-50 p-4 rounded-lg">
              <Typography variant="body1" className="text-gray-800 mb-3 font-medium">
                Is there any {tag} experiencing with the machine?
              </Typography>
              <FormControl component="fieldset">
                <Box className="flex items-center gap-6">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagChange(tag)}
                        color="primary"
                      />
                    }
                    label="Yes"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!selectedTags.includes(tag)}
                        onChange={() => handleTagChange(tag)}
                        color="secondary"
                      />
                    }
                    label="No"
                  />
                </Box>
              </FormControl>
            </Box>
          ))}
        </Card>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleShowReasons}
        className="mb-8 py-3 px-6 text-lg font-medium"
        fullWidth
      >
        Analyze Issues
      </Button>

      {showReasons && (
        <>
          <Card className="p-6 mb-6 shadow-lg bg-white">
            <Typography
              variant="h5"
              className="font-semibold text-gray-700 mb-4 border-b pb-3"
            >
              Possible Reasons
            </Typography>

          {filteredDetails.length > 0 ? (
            filteredDetails.map((detail, index) => (
              <Card
                key={index}
                className="mb-4 shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-gray-100"
                onClick={() => toggleSolutionVisibility(index)}
              >
                <CardContent className="hover:bg-gray-50">
                  <Typography
                    variant="body1"
                    className="text-gray-800 font-medium"
                  >
                    <strong>Reason:</strong> {detail.reason}
                  </Typography>
                  {expandedIndex === index && (
                    <Box className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <Typography variant="body2" className="text-gray-700">
                        <strong className="text-blue-700">Solution:</strong> {detail.solution}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1" className="text-gray-500">
              No details match the selected tags.
            </Typography>
          )}
          </Card>
        </>
      )}
    </div>
  );
};

export default FailureDetails;
