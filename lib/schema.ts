import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
  primaryKey,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "student"]);
export const submissionStatusEnum = pgEnum("submission_status", [
  "pending",
  "approved",
  "rejected",
]);
const baseSchema = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),
    username: text("username").unique().notNull(),
    email: text("email").unique().notNull(),
    emailVerified: timestamp("email_verified"),

    coverCldPubId: text("cover_cld_pub_id").default("default-cover"),
    imageCldPubId: text("image_cld_pub_id").default("default-avatar"),

    role: roleEnum("role").default("student").notNull(),
    active: boolean("active").default(false).notNull(),

    // Academy fields
    bio: text("bio"),
    phone: text("phone"),
    level: text("level").default("Beginner").notNull(),
    totalPoints: integer("total_points").default(0).notNull(),
    isDeleted: boolean("is_deleted").default(false).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    pointsIndex: index("users_total_points_idx").on(table.totalPoints),
  }),
);

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),

    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),

    password: text("password"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);
export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({
      columns: [vt.identifier, vt.token],
    }),
  }),
);

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").unique().notNull(),
  description: text("description"),
  icon: text("icon"), // icon name or URL
  isDeleted: boolean("is_deleted").default(false).notNull(),

  ...baseSchema,
});

export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").default(0).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  bannerUrl: text("banner_url").notNull(),
  duration: integer("duration").notNull(), // in hours
  level: text("level").notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "restrict" }),
  instructorId: text("instructor_id").notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),

  ...baseSchema,
});

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),

    enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueEnrollment: uniqueIndex("unique_enrollment").on(
      table.studentId,
      table.courseId,
    ),
  }),
);

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  courseId: uuid("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  imageCldPubId: text("image_cld_pub_id").notNull(),
  points: integer("points").default(50),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  ...baseSchema,
});

export const projectSubmissions = pgTable(
  "project_submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),

    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    repoLink: text("repo_link"),
    demoLink: text("demo_link"),

    status: submissionStatusEnum("status").default("pending").notNull(),
    pointsEarned: integer("points_earned").default(0),

    submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueSubmission: uniqueIndex("unique_submission").on(
      table.projectId,
      table.studentId,
    ),
  }),
);

export const achievements = pgTable("achievements", {
  id: uuid("id").defaultRandom().primaryKey(),

  imageCldPubId: text("image_cld_pub_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),

  requiredPoints: integer("required_points"),

  ...baseSchema,
});

export const lessonTypeEnum = pgEnum("lesson_type", [
  "video",
  "text",
  "project",
  "quiz",
  "assignment",
]);

export const resourceTypeEnum = pgEnum("resource_type", [
  "file",
  "link",
  "video",
  "image",
  "code",
]);

export const progressStatusEnum = pgEnum("progress_status", [
  "not_started",
  "in_progress",
  "completed",
]);

export const courseChapters = pgTable(
  "course_chapters",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    order: integer("order").notNull(),
    isDeleted: boolean("is_deleted").default(false).notNull(),
    ...baseSchema,
  },
  (table) => ({
    courseChapterOrderIndex: index("course_chapter_order_idx").on(
      table.courseId,
      table.order,
    ),
  }),
);

export const courseLessons = pgTable(
  "course_lessons",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),

    // ✅ Direct FK — replaces the junction table chapterLessons
    chapterId: uuid("chapter_id").references(() => courseChapters.id, {
      onDelete: "set null",
    }),

    title: text("title").notNull(),
    description: text("description"),
    content: text("content"),
    videoUrl: text("video_url"),

    // ✅ duration in SECONDS (matches seed data: 41s, 363s, etc.)
    duration: integer("duration").notNull(),

    lessonType: lessonTypeEnum("lesson_type").default("text").notNull(),
    order: integer("order").notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    isRequired: boolean("is_required").default(true).notNull(),

    projectInstructions: text("project_instructions"),
    starterCode: text("starter_code"),
    solutionCode: text("solution_code"),

    isDeleted: boolean("is_deleted").default(false).notNull(),
    ...baseSchema,
  },
  (table) => ({
    courseOrderIndex: index("course_lesson_order_idx").on(
      table.courseId,
      table.order,
    ),
    // ✅ Index for fetching all lessons in a chapter
    chapterIndex: index("course_lesson_chapter_idx").on(table.chapterId),
  }),
);

export const lessonResources = pgTable(
  "lesson_resources",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => courseLessons.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    resourceType: resourceTypeEnum("resource_type").notNull(),
    fileUrl: text("file_url"),
    fileName: text("file_name"),
    fileSize: integer("file_size"),
    cloudinaryPublicId: text("cloudinary_public_id"),
    url: text("url"),
    code: text("code"),
    language: text("language"),
    order: integer("order").default(0).notNull(),
    isDeleted: boolean("is_deleted").default(false).notNull(),
    ...baseSchema,
  },
  (table) => ({
    lessonOrderIndex: index("lesson_resource_order_idx").on(
      table.lessonId,
      table.order,
    ),
  }),
);

export const studentLessonProgress = pgTable(
  "student_lesson_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => courseLessons.id, { onDelete: "cascade" }),
    status: progressStatusEnum("status").default("not_started").notNull(),
    progressPercent: integer("progress_percent").default(0).notNull(),

    // ✅ timeSpent in SECONDS for precision
    timeSpent: integer("time_spent").default(0).notNull(),

    projectSubmitted: boolean("project_submitted").default(false).notNull(),
    projectSubmissionId: uuid("project_submission_id").references(
      () => projectSubmissions.id,
      { onDelete: "set null" },
    ),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull(),
    ...baseSchema,
  },
  (table) => ({
    uniqueStudentLesson: uniqueIndex("unique_student_lesson").on(
      table.studentId,
      table.lessonId,
    ),
    // ✅ Index for fetching all progress for a student in a course
    studentIndex: index("student_lesson_progress_student_idx").on(
      table.studentId,
    ),
  }),
);

export const studentAchievements = pgTable(
  "student_achievements",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    achievementId: uuid("achievement_id")
      .notNull()
      .references(() => achievements.id, { onDelete: "cascade" }),

    earnedAt: timestamp("earned_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueEarned: uniqueIndex("unique_student_achievement").on(
      table.studentId,
      table.achievementId,
    ),
  }),
);
