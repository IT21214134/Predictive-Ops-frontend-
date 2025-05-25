export const STATUS_COLORS = {
  good: {
    main: "#2E7D32",
    light: "#E8F5E9",
    dark: "#1B5E20",
    gradient: "linear-gradient(135deg, #43A047 0%, #2E7D32 100%)",
    icon: "🟢",
  },
  moderate: {
    main: "#F57C00",
    light: "#FFF3E0",
    dark: "#E65100",
    gradient: "linear-gradient(135deg, #FB8C00 0%, #F57C00 100%)",
    icon: "🟡",
  },
  critical: {
    main: "#C62828",
    light: "#FFEBEE",
    dark: "#B71C1C",
    gradient: "linear-gradient(135deg, #D32F2F 0%, #C62828 100%)",
    icon: "🔴",
  },
} as const;
