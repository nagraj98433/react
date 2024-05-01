import { themeColor } from "./constants";

export const activeSidebarItemStyle = {
  borderLeft: `4px solid ${themeColor.primary}`,
  color: themeColor.primary,
  fontWeight: "500",
};
export const notActiveSidebarItemStyle = {
  color: themeColor.textSecondary,
};
export const activeSidebarItemChildStyle = {
  color: themeColor.primary,
  fontWeight: "500",
};
export const notActiveSidebarItemChildStyle = {
  color: themeColor.textSecondary,
};
export const activeTabStyle = {
  color: themeColor.primary,
  fontWeight: "500",
  borderBottom: `1px solid ${themeColor.primary}`,
  transition: "0.3s ease-in-out",
  backgroundColor: themeColor.accent,
};
export const inActiveTabStyle = {
  color: themeColor.textSecondary,
  fontWeight: "500",
  borderBottom: `1px solid white`,
};
export const checkedStyle = {
  backgroundColor: themeColor.primary,
  border: `1px solid ${themeColor.primary}`,
};
