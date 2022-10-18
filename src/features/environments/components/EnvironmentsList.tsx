import React, { useEffect, useMemo, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import GroupIcon from "@mui/icons-material/Group";
import { EnvironmentDropdown } from "./EnvironmentDropdown";
import { Environment, Namespace } from "../../../common/models";
import { StyledScrollContainer } from "../../../styles";
import { INamespaceEnvironments } from "../../../common/interfaces";
import lodash from "lodash";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  environmentsTitleGrayscaleStyles,
  environmentsTitleGreenAccentStyles
} from "../styles";
import {
  getIconForStyleType,
  getStylesForStyleType
} from "../../../utils/helpers";
import { CondaLogo, GroupIconAlt } from "../../../components";
import { config } from "../../../common/constants";

interface IEnvironmentsListProps {
  /**
   * @param environmentsList environments list
   * @param namespacesList namespaces list
   * @param hasMore indicates whether there are more items to fetch
   * @param next function that will run on the bottom of the inf scroll
   * @param search current search
   */
  environmentsList: Environment[];
  namespacesList: Namespace[];
  hasMore: boolean;
  next: () => void;
  search: string;
}

export const EnvironmentsList = ({
  environmentsList,
  namespacesList,
  hasMore,
  next,
  search
}: IEnvironmentsListProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isGrayScaleStyleType = config.styleType === "grayscale";

  const titleStyles = getStylesForStyleType(
    environmentsTitleGrayscaleStyles,
    environmentsTitleGreenAccentStyles
  );

  const titleIcon = getIconForStyleType(
    <GroupIcon />,
    <GroupIconAlt style={{ marginBottom: "8px", marginLeft: "10px" }} />
  );

  const { defaultNamespace, sharedNamespaces } = useMemo(() => {
    let defaultNamespace: INamespaceEnvironments | null = null;
    const sharedNamespaces: INamespaceEnvironments[] = [];

    //List of all namespaces without environments inside
    const emptyNamespaces = namespacesList
      .map(namespace => namespace.name)
      .filter(
        elemen =>
          !environmentsList
            .map(environment => environment.namespace.name)
            .includes(elemen)
      );

    emptyNamespaces.forEach(element => {
      const value: Environment[] = [];
      const obj = { namespace: element, environments: value };
      if (element === "default") {
        defaultNamespace = obj;
      } else {
        sharedNamespaces.push(obj);
      }
    });

    lodash(environmentsList)
      .groupBy((x: Environment) => x.namespace.name)
      .map((value: Environment[], key: string) => {
        const obj = { namespace: key, environments: value };

        if (obj.namespace === "default") {
          defaultNamespace = obj;
          return;
        }

        sharedNamespaces.push(obj);
      })
      .value();

    return { defaultNamespace, sharedNamespaces };
  }, [environmentsList, namespacesList]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [search]);

  return (
    <StyledScrollContainer
      sx={{
        height: "100%",
        position: "relative"
      }}
      id="environmentsScroll"
      ref={scrollRef}
    >
      <InfiniteScroll
        scrollableTarget="environmentsScroll"
        style={{ overflow: "hidden" }}
        dataLength={environmentsList.length}
        hasMore={hasMore}
        next={next}
        loader={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px"
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        <Box sx={{ minHeight: "50px" }}>
          {defaultNamespace && <EnvironmentDropdown data={defaultNamespace} />}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginLeft: "20px",
            marginTop: "5px"
          }}
        >
          <Typography sx={titleStyles}>Shared environments</Typography>
          {titleIcon}
        </Box>
        {sharedNamespaces.map(namespace => (
          <EnvironmentDropdown key={namespace.namespace} data={namespace} />
        ))}
      </InfiniteScroll>
      {!isGrayScaleStyleType && (
        <Box
          sx={{
            position: "absolute",
            bottom: "20px",
            left: "30px",
            zIndex: "-1"
          }}
        >
          <CondaLogo />
        </Box>
      )}
    </StyledScrollContainer>
  );
};
