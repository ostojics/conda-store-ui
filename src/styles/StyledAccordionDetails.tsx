import AccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/system";
import { config } from "../common/constants";

const currentStyleType = config.styleType;

export const StyledAccordionDetails = styled(AccordionDetails, {
  shouldForwardProp: prop => prop !== "styleType"
})<{ styleType?: string }>(
  ({ theme: { palette }, styleType = currentStyleType }) => ({
    border:
      styleType === "grayscale"
        ? `1px solid ${palette.primary.main}`
        : "1px solid #BCBFC4",
    borderTop: "none",
    borderRadius: styleType === "grayscale" ? "0px 0px 5px 5px" : "Opx",
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
      width: "15px"
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent"
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor:
        styleType === "grayscale" ? `${palette.primary.main}` : "#DADCE0",
      borderRadius: "10px",
      border: styleType === "grayscale" ? "1px solid #666666" : "none"
    }
  })
);
