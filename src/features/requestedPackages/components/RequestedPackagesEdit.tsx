import React, { useEffect, useMemo, useRef, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import { RequestedPackagesTableRow } from "./RequestedPackagesTableRow";
import { AddRequestedPackage } from "./AddRequestedPackage";
import {
  StyledAccordionDetails,
  StyledAccordionExpandIcon,
  StyledAccordionSummary,
  StyledAccordionTitle,
  StyledButtonPrimary,
  StyledEditPackagesTableCell
} from "../../../styles";
import { CondaSpecificationPip } from "../../../common/models";
import { useAppDispatch } from "../../../hooks";
import { packageAdded } from "../requestedPackagesSlice";
import { getIconForStyleType } from "../../../utils/helpers";
import { ArrowIcon } from "../../../components";
import { config } from "../../../common/constants";

export interface IRequestedPackagesEditProps {
  /**
   * @param packageList list of packages that we get from the API
   */
  packageList: (string | CondaSpecificationPip)[];
}

export const RequestedPackagesEdit = ({
  packageList
}: IRequestedPackagesEditProps) => {
  const dispatch = useAppDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const { palette } = useTheme();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isGrayscaleStyleType = config.styleType === "grayscale";

  const handleSubmit = (packageName: string) => {
    dispatch(packageAdded(packageName));
  };

  const icon = getIconForStyleType(
    <StyledAccordionExpandIcon />,
    <ArrowIcon />
  );

  const filteredPackageList = useMemo(
    () => packageList.filter(item => typeof item !== "object") as string[],
    [packageList]
  );

  useEffect(() => {
    if (isAdding && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isAdding]);

  return (
    <Accordion
      sx={{ width: 576, boxShadow: "none" }}
      defaultExpanded
      disableGutters
    >
      <StyledAccordionSummary expandIcon={icon}>
        <StyledAccordionTitle>Requested Packages</StyledAccordionTitle>
      </StyledAccordionSummary>
      <StyledAccordionDetails
        sx={{
          padding: "23px 21px",
          borderRadius: "0px"
        }}
      >
        <Table aria-label="requested packages">
          <TableHead sx={{ border: "none" }}>
            <TableRow>
              <StyledEditPackagesTableCell
                align="left"
                sx={{
                  width: "120px"
                }}
              >
                <Typography
                  component="p"
                  sx={{ fontSize: "16px", fontWeight: 500 }}
                >
                  Name
                </Typography>
              </StyledEditPackagesTableCell>
              <StyledEditPackagesTableCell
                align="left"
                sx={{
                  width: "180px"
                }}
              >
                <Typography
                  component="p"
                  sx={{ fontSize: "16px", fontWeight: 500 }}
                >
                  Installed Version
                </Typography>
              </StyledEditPackagesTableCell>
              <StyledEditPackagesTableCell align="left">
                <Typography
                  component="p"
                  sx={{ fontSize: "16px", fontWeight: 500 }}
                >
                  Version Constraint
                </Typography>
              </StyledEditPackagesTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPackageList.map(requestedPackage => (
              <RequestedPackagesTableRow
                key={requestedPackage}
                requestedPackage={requestedPackage}
              />
            ))}
          </TableBody>
        </Table>
        <Box ref={scrollRef}>
          {isAdding && (
            <AddRequestedPackage
              onSubmit={handleSubmit}
              onCancel={setIsAdding}
              isCreating={false}
            />
          )}
        </Box>
      </StyledAccordionDetails>
      <AccordionDetails
        sx={{
          border: `1px solid ${palette.primary.main}`,
          borderTop: "0px",
          borderRadius: isGrayscaleStyleType ? "0px 0px 5px 5px" : "0px",
          padding: "15px 21px",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <StyledButtonPrimary
          variant="contained"
          isAltType
          onClick={() => setIsAdding(true)}
        >
          + Add Package
        </StyledButtonPrimary>
      </AccordionDetails>
    </Accordion>
  );
};
