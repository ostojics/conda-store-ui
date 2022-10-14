import { format, utcToZonedTime } from "date-fns-tz";
import { IApiResponse } from "../../common/interfaces";
import { Build } from "../../common/models";

const STATUS_OPTIONS: any = {
  COMPLETED: "Available",
  QUEUED: "Queued",
  FAILED: "Failed",
  BUILDING: "Building"
};

const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

const isBuilding = (status: string) => {
  const BUILD_STATUS = ["BUILDING"];
  return BUILD_STATUS.includes(status);
};

const isQueued = (status: string) => {
  const BUILD_STATUS = ["QUEUED"];
  return BUILD_STATUS.includes(status);
};

const dateToTimezone = (date: string) => {
  const zonedDate = utcToZonedTime(`${date}Z`, TIMEZONE);
  return format(zonedDate, "MMMM do, yyyy - h:mm a", {
    timeZone: TIMEZONE
  });
};

export const buildMapper = (
  { data }: IApiResponse<Build[]>,
  currentBuildId: number
) => {
  return data.map(({ id, status, ended_on, scheduled_on }: Build) => {
    const dateDetails =
      isBuilding(status) || isQueued(status) ? scheduled_on : ended_on;
    const date = dateToTimezone(dateDetails);

    if (isBuilding(status)) {
      return {
        id,
        name: `${date} - Building`
      };
    }

    if (isQueued(status)) {
      return {
        id,
        name: `${date} - Queued`
      };
    }

    if (id === currentBuildId) {
      return {
        id,
        name: `${date} - Active`
      };
    }

    return {
      id,
      name: `${date} - ${STATUS_OPTIONS[status]}`
    };
  });
};
