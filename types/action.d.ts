interface SignInWithOAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: {
    email: string;
    name: string;
    image: string;
    username: string;
  };
}

interface AuthCredentails {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface CreateCourseParams {
  title: string;
  description: string;
  price: number;
  duration: number;
  level: string;
  category: string;
  bannerUrl: string;
  bannerCldPubId?: string;
  isPublished: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  enrolledCount: number;
  rating: number;
  status: "published" | "draft" | "archived";
}