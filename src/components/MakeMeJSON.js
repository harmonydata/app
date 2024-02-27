import React, { useState } from "react";
import DragDrop from "./DragDrop";
import { Paper } from "@mui/material";
import { useHistory } from "react-router-dom";
import InlineFeedback from "./InlineFeedback";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import pdfTableExtractor from "../utilities/pdf-table-extractor";

export default function MakeMeJSON({
  fileInfos,
  setFileInfos,
  setApiData,
  existingInstruments,
  ReactGA,
}) {
  const [loading, setLoading] = useState(false);
  const [parseError, setParseError] = useState(false);
  const [matchError, setMatchError] = useState(false);
  const [grouping, setGrouping] = useState("");
  const history = useHistory();

  function saveFile(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const a = document.createElement("a");
      document.body.appendChild(a);
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 0);
    }
  }
  function filesReceiver(fileList) {
    const files = Array.from(fileList);
    let frp = [];
    files.forEach((file) => {
      frp.push(
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (file.name.split(".").pop().toLowerCase() === "pdf") {
              const uint8array = Uint8Array.from(
                atob(reader.result.split(",")[1]),
                (c) => c.charCodeAt(0)
              );
              var typedarray = new Uint8Array(uint8array);

              pdfTableExtractor(typedarray)
                .then((tables) => {
                  resolve({
                    file_name: file.name,
                    file_type: file.name.split(".").pop().toLowerCase(),
                    tables: tables.pageTables,
                  });
                })
                .catch((e) => {
                  // PDF clientside parsing failed for some reason - defer to the server
                  console.log(e);
                  resolve({
                    file_name: file.name,
                    file_type: file.name.split(".").pop().toLowerCase(),
                  });
                });
            } else {
              resolve({
                file_name: file.name,
                file_type: file.name.split(".").pop().toLowerCase(),
              });
            }
          };
          reader.onerror = (e) => {
            reject(e);
          };
          reader.readAsDataURL(file);
        })
      );
    });
    Promise.all(frp)
      .then((allFiles) => {
        const json = JSON.stringify(allFiles, null, 2);
        var blob = new Blob([json], { type: "application/json" });
        saveFile(blob, "iMadeAJSON.json");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <Paper
      elevation={4}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: "1rem",
      }}
    >
      <ToastContainer />
      <InlineFeedback
        message="The file could not be parsed"
        severity="error"
        state={parseError}
        setState={setParseError}
      />
      <InlineFeedback
        message="The match proceedure failed"
        severity="error"
        state={matchError}
        setState={setMatchError}
      />

      <DragDrop filesReceiver={filesReceiver} sx={{ margin: "2rem" }} />
    </Paper>
  );
}
