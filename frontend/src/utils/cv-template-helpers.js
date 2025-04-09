import { placeholderData } from "./cv-placeholder-data";

export const getDisplayData = (userData, section, showPlaceholders = true) => {
  if (!showPlaceholders) {
    return userData[section];
  }

  // If the user data is empty or has empty arrays, use placeholder data
  if (
    !userData[section] ||
    (Array.isArray(userData[section]) && userData[section].length === 0) ||
    (typeof userData[section] === "object" &&
      Object.keys(userData[section]).length === 0)
  ) {
    return placeholderData[section];
  }

  return userData[section];
};
