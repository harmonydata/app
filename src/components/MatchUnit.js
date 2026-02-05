import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Link,
} from "@mui/material";
import "react-circular-progressbar/dist/styles.css";
import MatchCircle from "./MatchCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BugReportIcon from "@mui/icons-material/BugReport";
import { useTheme } from "@emotion/react";

const MatchUnit = ({ Q1, Q2, percentage, matchUnitMenuAction, selected }) => {
  const theme = useTheme()
  // const [isFlipped, setIsFlipped] = useState(false);
  const [menuElement, setMenuElement] = useState(null);

  // Helper function to get discovery app path
  const getDiscoveryNextPath = (path) => {
    if (typeof window !== "undefined") {
      // Handle local development - DiscoveryNext is on root
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        return path;
      }
      // Production - DiscoveryNext is under /search
      return `/search${path}`;
    }
    return `/search${path}`; // fallback for SSR
  };

  // Build discovery URL with topics and instruments from this match
  const getDiscoveryUrl = () => {
    const params = new URLSearchParams();
    
    // Add topics if available
    const topics = [];
    if (Q1.topics_strengths) {
      topics.push(...Object.keys(Q1.topics_strengths));
    }
    if (Q2.topics_strengths) {
      topics.push(...Object.keys(Q2.topics_strengths));
    }
    const uniqueTopics = [...new Set(topics)];
    uniqueTopics.forEach(topic => params.append("topics", topic));
    
    // Add instruments if available
    const instruments = [];
    if (Q1.instrument && Q1.instrument.name) {
      instruments.push(Q1.instrument.name);
    }
    if (Q2.instrument && Q2.instrument.name) {
      instruments.push(Q2.instrument.name);
    }
    const uniqueInstruments = [...new Set(instruments)];
    uniqueInstruments.forEach(instrument => params.append("instruments", instrument));
    
    const queryString = params.toString();
    return `${getDiscoveryNextPath("/")}${queryString ? `?${queryString}` : ""}`;
  };

  const openMenu = (event) => {
    event.stopPropagation();
    setMenuElement(event.currentTarget);
    return false;
  };
  const closeMenu = (value) => {
    matchUnitMenuAction({ q1: Q1, q2: Q2, match: percentage, action: value });
    setMenuElement(null);
  };

  const flipMe = (e) => {
    //setIsFlipped(!isFlipped);
    matchUnitMenuAction({ q1: Q1, q2: Q2, action: "select" });
  };

  return (
    //<ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
    <Card
      onClick={flipMe}
      elevation={selected ? 5 : 0}
      sx={{
        cursor: "pointer",
        display: "flex",
        width: "100%",
        height: { xs: "10rem", sm: "8rem" },
        padding: "0.5rem",
        margin: "0 0 1rem 0",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "center",
        border: selected ? "1px solid " + theme.palette.primary.main : "1px solid rgba(0, 0, 0, 0.12)",
        transform: selected ? "scale(1.02)" : "",
        transition: "transform 0.1s, box-shadow 0.1s",
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          width: "45%",
        }}
      >
        <Typography variant="caption" sx={{ fontSize: "0.625rem" }}>
          {Q1.instrument && Q1.instrument.name} - Q{Q1.question_no}
        </Typography>
        <Typography variant="body1" sx={{ overflowY: 'auto' }}>{Q1.question_text}</Typography>
        <Typography variant="caption" sx={{ visibility: "hidden" }}>
          {Q1.instrument && Q1.instrument.name} - Q{Q1.question_no}
        </Typography>
      </Box>
      <Box 
        sx={{ 
          width: "4em", 
          margin: "0.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <Tooltip title="Search for studies using these items">
          <Link
            href={getDiscoveryUrl()}
            target="HarmonyDiscovery"
            onClick={(e) => {
              e.stopPropagation();
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            <img
              src="/app/harmony.png"
              alt="Harmony Logo"
              style={{
                height: "1.5rem",
                width: "auto",
                cursor: "pointer",
              }}
            />
          </Link>
        </Tooltip>
        <MatchCircle percentage={percentage} />
      </Box>
      <Box
        sx={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          width: "45%",
          textAlign: "center",
        }}
      >
        <Typography variant="caption">
          {Q2.instrument && Q2.instrument.name} - Q{Q2.question_no}
        </Typography>
        <Typography variant="body1" sx={{ overflowY: 'auto' }} >{Q2.question_text}</Typography>
        <Typography variant="caption" sx={{ visibility: "hidden" }}>
          {Q2.instrument && Q2.instrument.name} - Q{Q2.question_no}
        </Typography>
      </Box>
      <IconButton
        edge="end"
        sx={{ mb: "auto", mt: "-12px", mr: "-6px", width: 0 }}
        onClick={openMenu}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={menuElement}
        id="match-unit-menu"
        open={Boolean(menuElement)}
        onClose={setMenuElement.bind(this, null)}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 0,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={closeMenu.bind(this, "report")}>
          <ListItemIcon>
            <BugReportIcon />
          </ListItemIcon>
          <Typography>
            Report incorrect match to Harmony (and remove)
          </Typography>
        </MenuItem>
      </Menu>
    </Card>
    /*  <Card
       onClick={flipMe}
       variant="outlined"
       sx={{
         cursor: "pointer",
         display: "flex",
         width: "100%",
         height: {xs:"10rem", sm:"7rem"},
         padding: "0.5rem",
         margin: "0 0 1rem 0",
         justifyContent: "space-between",
         alignItems: "center",
         textAlign: "center",
       }}
     >
       <Stack
         direction={"row"}
         spacing={2}
         sx={{
           height: "100%",
           width: "100%",
           justifyContent: "space-around",
           alignItems: "center",
         }}
       >
         <img
           style={{ height: "4rem", width: "unset" }}
           src={require("../img/sitelogo.png")}
         />

         <Box
           sx={{
             display: "flex",
             height: "100%",
             flexDirection: "column",
             justifyContent: "space-between",
             alignItems: "center",
           }}
         >
           <Typography variant="caption">
             Research topics from{" "}
             <Link
               href="https://www.cataloguementalhealth.ac.uk"
               target="_blank"
               color="inherit"
               onClick={(e) => {
                 e.stopPropagation();
               }}
             >
               Catalogue Mental Health
             </Link>
           </Typography>
           <Typography variant="body1">
             {[...new Set(Q1.topics_auto.concat(Q2.topics_auto))]
               .sort()
               .join(", ")}
           </Typography>

           <Typography variant="caption">
             <Link
               href={
                 "https://www.cataloguementalhealth.ac.uk/?content=search&query=Topic:" +
                 [...new Set(Q1.topics_auto.concat(Q2.topics_auto))]
                   .sort()
                   .join(" Topic:")
               }
               target="_blank"
               color="inherit"
               onClick={(e) => {
                 e.stopPropagation();
               }}
             >
               Search for studies exploring these topics
             </Link>
           </Typography>
         </Box>
       </Stack>
     </Card>
   </ReactCardFlip> */
  );
};

export default MatchUnit;
