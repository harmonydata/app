import { Popper, Fade, Paper, Box, styled } from "@mui/material";
import { useState } from "react";

const StyledPopper = styled(Popper)(({ theme }) => ({
  // You can replace with `PopperUnstyled` for lower bundle size.
  '&[data-popper-placement*="bottom"] .arrow': {
    top: 0,
    left: 0,
    marginTop: "-0.9em",
    width: "3em",
    height: "1em",
    "&::before": {
      borderWidth: "0 1em 1em 1em",
      borderColor: `transparent transparent ${theme.palette.background.paper} transparent`,
    },
  },
  '&[data-popper-placement*="top"] .arrow': {
    bottom: 0,
    left: 0,
    marginBottom: "-0.9em",
    width: "3em",
    height: "1em",
    "&::before": {
      borderWidth: "1em 1em 0 1em",
      borderColor: `${theme.palette.background.paper} transparent transparent transparent`,
    },
  },
  '&[data-popper-placement*="right"] .arrow': {
    left: 0,
    marginLeft: "-0.9em",
    height: "3em",
    width: "1em",
    "&::before": {
      borderWidth: "1em 1em 1em 0",
      borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
    },
  },
  '&[data-popper-placement*="left"] .arrow': {
    right: 0,
    marginRight: "-0.9em",
    height: "3em",
    width: "1em",
    "&::before": {
      borderWidth: "1em 0 1em 1em",
      borderColor: `transparent transparent transparent ${theme.palette.background.paper}`,
    },
  },
}));

function ArrowedPopper({ anchorEl, open, placement, children }) {
  const [arrowRef, setArrowRef] = useState(null);

  return (
    <Popper
      elevation={8}
      style={{ zIndex: 100, maxWidth: "500px", margin: "80px" }}
      anchorEl={anchorEl}
      open={open}
      placement={placement}
      transition
      modifiers={[
        {
          name: "flip",
          enabled: true,
          options: {
            altBoundary: false,
            rootBoundary: "document",
            padding: 8,
          },
        },
        {
          name: "preventOverflow",
          enabled: true,
          options: {
            altAxis: false,
            altBoundary: false,
            tether: true,
            rootBoundary: "document",
            padding: 8,
          },
        },
        {
          name: "arrow",
          enabled: false,
          options: {
            element: arrowRef,
          },
        },
      ]}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={300}>
          <Paper elevation={8} sx={{ p: 2 }}>
            {children}
          </Paper>
          {/* <Box
            component="span"
            className="arrow"
            ref={setArrowRef}
            style={{
              position: "absolute",
              fontSize: 7,
              width: "3em",
              height: "3em",
              "&::before": {
                content: '""',
                margin: "auto",
                display: "block",
                width: 0,
                height: 0,
                borderStyle: "solid",
              },
            }}
          /> */}
        </Fade>
      )}
    </Popper>
  );
}

export default ArrowedPopper;
