import React, { useEffect, useMemo, useState } from "react";
import {
  Divider,
  Card,
  Slider,
  Switch,
  Typography,
  Stack,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { ReactComponent as xlsxSVG } from "../img/file-excel-solid.svg";
import { ReactComponent as pdfSVG } from "../img/file-pdf-solid.svg";
import DropdownShareButton from "./DropdownShareButton";
import SvgIcon from "@mui/material/SvgIcon";
import { useAuth } from "../contexts/AuthContext";
import { useDebounce } from "react-use-custom-hooks";
import PopperHelp from "./PopperHelp";

export default function ResultsOptions({
  resultsOptions,
  setResultsOptions,
  makePublicShareLink,
  saveToMyHarmony,
  downloadExcel,
  downloadPDF,
  ReactGA,
  toaster,
}) {
  const [threshold, setThreshold] = useState(resultsOptions.threshold);
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setThreshold(resultsOptions.threshold);
    setSearchTerm(resultsOptions.searchTerm);
  }, [resultsOptions]);

  useMemo(() => {
    if (debouncedSearchTerm !== resultsOptions.searchTerm) {
      let thisOptions = { ...resultsOptions };
      thisOptions.searchTerm = debouncedSearchTerm;
      setResultsOptions(thisOptions);
    }
  }, [debouncedSearchTerm, resultsOptions, setResultsOptions]);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        width: { xs: "100%", sm: "75%" },
        margin: "auto",
        padding: "1rem",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Options</h2>
      <Stack>
        <div>
          <Typography id="Threshold">Match Threshold</Typography>
        </div>
        <Slider
          value={threshold}
          min={0}
          valueLabelDisplay="auto"
          onChange={(e, value) => {
            setThreshold(value);
          }}
          onChangeCommitted={(e, value) => {
            let thisOptions = { ...resultsOptions };
            thisOptions.threshold = value;
            setResultsOptions(thisOptions);
          }}
        />
        <Divider sx={{ mt: 1, mb: 1 }} />
        <TextField
          sx={{ mt: 1, mb: 1 }}
          id="outlined-basic"
          label="Search"
          autoComplete="off"
          inputProps={{
            autoComplete: "off",
          }}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          value={searchTerm}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <PopperHelp>
                  <Typography>
                    This supports Lucene-like queries. So you can use wildcards,
                    logical operators, parentheses, and negation to create
                    precise and complex searches. You can also search within
                    specific data fields (instrument, question, or topic) e.g.
                    <br />
                    <br />
                    <b>instrument:RCAD and instrument:GAD</b>
                    <br />
                    <br />
                    which will show matches in your results between these two
                    instruments only.
                  </Typography>
                </PopperHelp>
              </InputAdornment>
            ),
          }}
        />
        <Divider sx={{ mt: 1, mb: 1 }} />
        <Stack
          direction="row"
          sx={{
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography id="withinInstruments">
            Show within-instrument matches
          </Typography>
          <Switch
            checked={resultsOptions.intraInstrument}
            onChange={(event) => {
              let thisOptions = { ...resultsOptions };
              thisOptions.intraInstrument = event.target.checked;
              setResultsOptions(thisOptions);
            }}
          />
        </Stack>
        <Stack
          direction="row"
          sx={{
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography id="withinInstruments">Just selected matches</Typography>
          <Switch
            checked={resultsOptions.onlySelected}
            onChange={(event) => {
              let thisOptions = { ...resultsOptions };
              thisOptions.onlySelected = event.target.checked;
              setResultsOptions(thisOptions);
            }}
          />
        </Stack>
        <Divider sx={{ mt: 1, mb: 1 }} />
        <Stack
          direction="row"
          sx={{
            width: "100%",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          {currentUser && (
            <DropdownShareButton
              getShareLink={makePublicShareLink}
              ReactGA={ReactGA}
            />
          )}
          <Button
            variant="contained"
            onClick={() => {
              ReactGA &&
                ReactGA.event({
                  category: "Actions",
                  action: "Export Matches",
                });
              downloadExcel();
            }}
          >
            <SvgIcon component={xlsxSVG} inheritViewBox />
            <Typography> Export Excel</Typography>
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              ReactGA &&
                ReactGA.event({
                  category: "Actions",
                  action: "Export PDF",
                });
              downloadPDF();
            }}
          >
            <SvgIcon component={pdfSVG} inheritViewBox />
            <Typography> Export PDF </Typography>
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
