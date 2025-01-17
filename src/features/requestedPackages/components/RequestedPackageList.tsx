import Accordion from "@mui/material/Accordion";
import Box from "@mui/material/Box";
import React, { useMemo } from "react";
import { RequestedPackage } from ".";
import { CondaSpecificationPip } from "../../../common/models";
import { ArrowIcon } from "../../../components";
import {
  StyledAccordionDetails,
  StyledAccordionExpandIcon,
  StyledAccordionSummary,
  StyledAccordionTitle
} from "../../../styles";
import {
  getIconForStyleType,
  getStylesForStyleType
} from "../../../utils/helpers";

export interface IRequestedPackageListProps {
  /**
   * @param packageList list of packages that we get from the API
   */
  packageList: (string | CondaSpecificationPip)[];
}

export const RequestedPackageList = ({
  packageList
}: IRequestedPackageListProps) => {
  const filteredPackageList = useMemo(
    () => packageList.filter(item => typeof item !== "object"),
    [packageList]
  );
  const listLength = filteredPackageList.length;

  const accordionDetailsStyles = getStylesForStyleType(
    { padding: "11px 40px" },
    { padding: "11px 21px" }
  );

  const expandIcon = getIconForStyleType(
    <StyledAccordionExpandIcon />,
    <ArrowIcon />
  );

  return (
    <Accordion
      sx={{ width: 421, boxShadow: "none" }}
      disableGutters
      defaultExpanded
    >
      <StyledAccordionSummary expandIcon={expandIcon}>
        <StyledAccordionTitle>Requested Packages</StyledAccordionTitle>
      </StyledAccordionSummary>
      <StyledAccordionDetails sx={accordionDetailsStyles}>
        {filteredPackageList.map((item, index) => (
          <Box
            key={`${item}`}
            sx={{ marginBottom: index === listLength - 1 ? "0px" : "15px" }}
          >
            <RequestedPackage requestedPackage={`${item}`} />
          </Box>
        ))}
      </StyledAccordionDetails>
    </Accordion>
  );
};
