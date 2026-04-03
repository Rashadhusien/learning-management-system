/**
 * Accessible badge color combinations with sufficient contrast ratios
 * Following WCAG AA standards (4.5:1 for normal text)
 */

export const accessibleBadgeColors = {
  // Level badges
  beginner: {
    bg: "bg-green-600",
    text: "text-white",
    border: "border-green-700",
    hover: "hover:bg-green-700"
  },
  intermediate: {
    bg: "bg-blue-700", 
    text: "text-white",
    border: "border-blue-800",
    hover: "hover:bg-blue-800"
  },
  advanced: {
    bg: "bg-purple-700",
    text: "text-white", 
    border: "border-purple-800",
    hover: "hover:bg-purple-800"
  },
  
  // Status badges
  published: {
    bg: "bg-green-600",
    text: "text-white",
    border: "border-green-700", 
    hover: "hover:bg-green-700"
  },
  draft: {
    bg: "bg-gray-600",
    text: "text-white",
    border: "border-gray-700",
    hover: "hover:bg-gray-700"
  },
  
  // Category badges with good contrast
  webdev: {
    bg: "bg-blue-100",
    text: "text-blue-900",
    border: "border-blue-200",
    hover: "hover:bg-blue-200"
  },
  ml: {
    bg: "bg-purple-100", 
    text: "text-purple-900",
    border: "border-purple-200",
    hover: "hover:bg-purple-200"
  },
  design: {
    bg: "bg-pink-100",
    text: "text-pink-900", 
    border: "border-pink-200",
    hover: "hover:bg-pink-200"
  }
} as const;

export type BadgeColorKey = keyof typeof accessibleBadgeColors;

export function getAccessibleBadgeClasses(key: BadgeColorKey) {
  return accessibleBadgeColors[key];
}
