import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { StyledButtonPrimary } from "src/styles";
import { useAppDispatch, useAppSelector } from "src/hooks";
import {
  EnvironmentDetailsModes,
  modeChanged
} from "../environmentDetailsSlice";

interface IEnvironmentDetailsHeaderProps {
  /**
   * @param envName name of the selected environment
   * @param onUpdateName change environment name
   */
  envName: string;
  onUpdateName: (value: string) => void;
}

export const EnvironmentDetailsHeader = ({
  envName,
  onUpdateName
}: IEnvironmentDetailsHeaderProps) => {
  const { mode } = useAppSelector(state => state.environmentDetails);
  const dispatch = useAppDispatch();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "19px"
      }}
    >
      {(mode === EnvironmentDetailsModes.READ ||
        mode === EnvironmentDetailsModes.EDIT) && (
        <>
          <Typography sx={{ fontSize: "24px", color: "#000" }}>
            {envName}
          </Typography>
          {mode === EnvironmentDetailsModes.READ && (
            <StyledButtonPrimary
              onClick={() =>
                dispatch(modeChanged(EnvironmentDetailsModes.EDIT))
              }
            >
              Edit
            </StyledButtonPrimary>
          )}
        </>
      )}
      {mode === EnvironmentDetailsModes.CREATE && (
        <>
          <TextField
            sx={{
              backgroundColor: "#ECECEC",
              border: "1px solid #000",
              width: "500px"
            }}
            inputProps={{
              style: {
                padding: "8px 16px",
                border: "none",
                fontSize: "24px",
                fontWeight: 500
              }
            }}
            variant="filled"
            value={envName}
            placeholder="Environment name"
            onChange={e => onUpdateName(e.target.value)}
          />
          {/* <StyledButtonPrimary>Archive</StyledButtonPrimary> */}
        </>
      )}
    </Box>
  );
};
