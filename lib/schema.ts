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

    image: text("image"),

    role: roleEnum("role").default("student").notNull(),

    // Academy fields
    bio: text("bio"),
    phone: text("phone"),
    level: text("level").default("Beginner"),
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

  title: text("title").notNull(),
  description: text("description"),

  requiredPoints: integer("required_points"),

  ...baseSchema,
});

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
