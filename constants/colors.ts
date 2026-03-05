// Course Level Color System
export const COURSE_LEVELS = {
  BEGINNER: {
    name: "Beginner",
    color: "bg-green-100 text-green-800 border-green-200",
    badgeVariant: "default" as const,
    icon: "🌱",
  },
  INTERMEDIATE: {
    name: "Intermediate", 
    color: "bg-blue-100 text-blue-800 border-blue-200",
    badgeVariant: "secondary" as const,
    icon: "🌿",
  },
  ADVANCED: {
    name: "Advanced",
    color: "bg-purple-100 text-purple-800 border-purple-200", 
    badgeVariant: "outline" as const,
    icon: "🌳",
  },
  EXPERT: {
    name: "Expert",
    color: "bg-red-100 text-red-800 border-red-200",
    badgeVariant: "destructive" as const,
    icon: "🔥",
  },
} as const;

// Category Color System
export const CATEGORY_COLORS = [
  {
    name: "Web Development",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "💻",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Mobile Development", 
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: "📱",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Data Science",
    color: "bg-green-100 text-green-800 border-green-200", 
    icon: "📊",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    name: "Machine Learning",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: "🤖", 
    gradient: "from-orange-500 to-red-500",
  },
  {
    name: "DevOps",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "⚙️",
    gradient: "from-gray-500 to-slate-500",
  },
  {
    name: "UI/UX Design",
    color: "bg-pink-100 text-pink-800 border-pink-200",
    icon: "🎨",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    name: "Blockchain",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "🔗",
    gradient: "from-yellow-500 to-amber-500",
  },
  {
    name: "Cloud Computing",
    color: "bg-sky-100 text-sky-800 border-sky-200",
    icon: "☁️",
    gradient: "from-sky-500 to-blue-500",
  },
] as const;

// Helper functions
export function getLevelConfig(level: string) {
  const normalizedLevel = level.toUpperCase().trim();
  return COURSE_LEVELS[normalizedLevel as keyof typeof COURSE_LEVELS] || {
    name: level,
    color: "bg-gray-100 text-gray-800 border-gray-200",
    badgeVariant: "outline" as const,
    icon: "📚",
  };
}

export function getCategoryConfig(categoryName: string) {
  const found = CATEGORY_COLORS.find(
    cat => cat.name.toLowerCase() === categoryName.toLowerCase()
  );
  
  if (found) return found;
  
  // Generate a consistent color based on category name hash
  const colors = CATEGORY_COLORS;
  const hash = categoryName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % colors.length;
  
  return {
    ...colors[index],
    name: categoryName,
  };
}

// Course status colors
export const COURSE_STATUS = {
  PUBLISHED: {
    name: "Published",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "✅",
  },
  DRAFT: {
    name: "Draft", 
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "📝",
  },
  ARCHIVED: {
    name: "Archived",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "📦",
  },
} as const;

export function getStatusConfig(isPublished: boolean, isDeleted?: boolean) {
  if (isDeleted) {
    return COURSE_STATUS.ARCHIVED;
  }
  return isPublished ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
}
