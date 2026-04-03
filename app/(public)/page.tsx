import Hero from "@/components/Hero";
import { getAuthSession } from "@/lib/auth-wrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import {
  BookOpen,
  Users,
  Trophy,
  Target,
  Star,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  User,
} from "lucide-react";
import CourseCard from "@/components/cards/CourseCard";
import ProjectCard from "@/components/cards/ProjectCard";
import {
  getRecentCourses,
  getRecentProjects,
  getRecentStudents,
} from "@/lib/actions/stats.action";
import StudentCard from "@/components/cards/StudentCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getAuthSession();

  const coursesResponse = await getRecentCourses();
  const projectsResponse = await getRecentProjects();
  const studentsResponse = await getRecentStudents();

  const courses =
    coursesResponse.success && coursesResponse.data
      ? coursesResponse.data.courses
      : [];
  const projects =
    projectsResponse.success && projectsResponse.data
      ? projectsResponse.data.projects
      : [];
  const students =
    studentsResponse.success && studentsResponse.data
      ? studentsResponse.data.students
      : [];

  console.log(courses);

  return (
    <main className="min-h-screen">
      <Hero />

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive learning platform provides all the tools and
              resources you need to master new skills and advance your career.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Rich Course Content</CardTitle>
                <CardDescription>
                  Access comprehensive courses with video lessons, interactive
                  quizzes, and hands-on projects.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Community Learning</CardTitle>
                <CardDescription>
                  Connect with fellow learners, share insights, and collaborate
                  on projects in our vibrant community.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Achievements & Rewards</CardTitle>
                <CardDescription>
                  Earn badges, certificates, and recognition as you complete
                  courses and reach milestones.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Monitor your learning journey with detailed analytics and
                  personalized recommendations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Portfolio Projects</CardTitle>
                <CardDescription>
                  Build real-world projects that showcase your skills to
                  potential employers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Skill Development</CardTitle>
                <CardDescription>
                  Progress through skill levels from beginner to expert with
                  structured learning paths.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest Projects & Courses */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Latest Content
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Fresh from Our Community
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover amazing projects and courses created by our talented
              students and instructors.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Latest Projects */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="h-6 w-6 text-primary" />
                <h3 className="text-2xl font-bold">Featured Projects</h3>
              </div>

              <div className="grid max-lg:grid-cols-2 gap-6">
                {projects &&
                  projects?.map((project, index) => (
                    <ProjectCard project={project} key={index} />
                  ))}
              </div>

              <Button variant="outline" className="w-full" asChild>
                <Link href={ROUTES.PROJECTS}>
                  View All Projects <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Latest Courses */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-6 w-6 text-primary" />
                <h3 className="text-2xl font-bold">New Courses</h3>
              </div>

              <div className="grid max-lg:grid-cols-2  gap-6">
                {courses?.map((course) => (
                  <CourseCard course={course} key={course.id} />
                ))}
              </div>

              <Button variant="outline" className="w-full" asChild>
                <Link href={ROUTES.COURSES}>
                  Browse All Courses <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Students Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Community
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Join Our Learning Community
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Meet some of our recent students who are on their learning
              journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students?.map((student) => (
              <StudentCard student={student} key={student.id} />
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full max-w-md flex items-center mx-auto mt-8"
            asChild
          >
            <Link href={ROUTES.STUDENTS}>
              View All Students <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">1000+</div>
              <div className="text-muted-foreground">Active Students</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">50+</div>
              <div className="text-muted-foreground">Expert Courses</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Categories
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Explore Our Course Categories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from a wide range of categories designed to help you
              achieve your learning goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Web Development",
                icon: "🌐",
                courses: 12,
                color: "bg-blue-500",
              },
              {
                name: "Mobile Development",
                icon: "📱",
                courses: 8,
                color: "bg-green-500",
              },
              {
                name: "Data Science",
                icon: "📊",
                courses: 10,
                color: "bg-purple-500",
              },
              {
                name: "UI/UX Design",
                icon: "🎨",
                courses: 6,
                color: "bg-pink-500",
              },
              {
                name: "Cloud Computing",
                icon: "☁️",
                courses: 7,
                color: "bg-cyan-500",
              },
              {
                name: "DevOps",
                icon: "⚙️",
                courses: 5,
                color: "bg-orange-500",
              },
              {
                name: "Machine Learning",
                icon: "🤖",
                courses: 9,
                color: "bg-red-500",
              },
              {
                name: "Cybersecurity",
                icon: "🔒",
                courses: 4,
                color: "bg-indigo-500",
              },
            ].map((category, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  {/* <CardDescription>
                    {category.courses} courses available
                  </CardDescription> */}
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Learning Paths
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Structured Learning Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow our carefully crafted learning paths to master new skills
              step by step.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-500">Beginner</Badge>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Quick Start Path
                </CardTitle>
                <CardDescription>
                  Perfect for beginners looking to get started with web
                  development fundamentals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "HTML & CSS Basics",
                    "JavaScript Fundamentals",
                    "React Introduction",
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6" variant="outline">
                  Start Learning
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-blue-500">Intermediate</Badge>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Professional Path
                </CardTitle>
                <CardDescription>
                  Advance your skills with comprehensive full-stack development
                  training.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Advanced React",
                    "Node.js & Express",
                    "Database Design",
                    "Deployment",
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6" variant="outline">
                  Continue Learning
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-purple-500">Advanced</Badge>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  Expert Path
                </CardTitle>
                <CardDescription>
                  Master advanced concepts and become an expert in your field.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "System Architecture",
                    "Performance Optimization",
                    "Security Best Practices",
                    "Team Leadership",
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Star className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6" variant="outline">
                  Expert Level
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Success Stories
            </Badge>
            <h2 className="text-4xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of successful learners who transformed their
              careers with our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Frontend Developer",
                content:
                  "This platform completely transformed my career. The structured learning paths and hands-on projects helped me land my dream job!",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "Full Stack Engineer",
                content:
                  "The quality of courses and community support is outstanding. I went from zero to deploying production-ready applications in just 6 months.",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "UI/UX Designer",
                content:
                  "The portfolio projects I built here directly led to multiple job offers. The curriculum is practical and industry-relevant.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-semibold">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto text-center p-12 border-2 border-primary/20">
            <CardHeader className="space-y-4">
              <Badge variant="outline" className="w-fit mx-auto">
                Get Started Today
              </Badge>
              <CardTitle className="text-4xl">
                Ready to Start Your Learning Journey?
              </CardTitle>
              <CardDescription className="text-xl">
                Join thousands of students who are already building their future
                with our platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {session ? (
                  <>
                    <Button size="lg" className="text-lg px-8" asChild>
                      <Link href={ROUTES.COURSES}>
                        Browse Courses <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8"
                      asChild
                    >
                      <Link href={ROUTES.PROFILE}>Go to Profile</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="lg" className="text-lg px-8" asChild>
                      <Link href={ROUTES.REGISTER}>
                        Sign Up Free <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8"
                      asChild
                    >
                      <Link href={ROUTES.COURSES}>View Courses</Link>
                    </Button>
                  </>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Free trial available</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Global Reach Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Global Impact
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Learning Without Boundaries
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join a global community of learners from around the world.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">50+</div>
                <div className="text-muted-foreground">Countries</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">1000+</div>
                <div className="text-muted-foreground">Active Students</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">50+</div>
                <div className="text-muted-foreground">Expert Courses</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-muted-foreground">Certificates Issued</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
