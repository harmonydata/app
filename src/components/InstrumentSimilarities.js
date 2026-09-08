import React from "react";
import { Card, Box, Typography, Chip, Stack, Divider } from "@mui/material";

export default function InstrumentSimilarities({ similarities }) {
  if (!similarities || !similarities.length) return null;

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        width: "100%",
        padding: "1rem",
        margin: "0 0 1rem 0",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        Instrument similarities
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        These scores indicate how similar each pair of instruments is overall.
      </Typography>

      <Stack direction="column" divider={<Divider flexItem />} spacing={1}>
        {similarities.map((s, idx) => (
          <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <Typography variant="subtitle2" sx={{ minWidth: 200 }}>
              {s.instrument_1_name} ↔ {s.instrument_2_name}
            </Typography>
            <Stack direction="row" spacing={1}>
              {typeof s.f1 !== "undefined" && (
                <Chip label={`F1: ${roundPct(s.f1)}`} color="primary" variant="outlined" />
              )}
              {typeof s.precision !== "undefined" && (
                <Chip label={`Precision: ${roundPct(s.precision)}`} variant="outlined" />
              )}
              {typeof s.recall !== "undefined" && (
                <Chip label={`Recall: ${roundPct(s.recall)}`} variant="outlined" />
              )}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}

function roundPct(value) {
  // If value appears already in percentage form (0-100), cap and show; otherwise convert from 0-1
  const v = value > 1 ? value : value * 100;
  return `${Math.round(v)}%`;
}
