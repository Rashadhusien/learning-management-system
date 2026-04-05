import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  BookOpen,
  Users,
  Settings,
  CreditCard,
  Shield,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";
import PageTitle from "@/components/PageTitle";

const HelpCenter = () => {
  const helpCategories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics of our platform",
      articles: [
        "Creating Your Account",
        "Navigating the Dashboard",
        "Finding Courses",
        "Understanding Your Profile",
      ],
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Users,
      title: "Account & Profile",
      description: "Manage your account settings",
      articles: [
        "Updating Personal Information",
        "Changing Your Password",
        "Profile Customization",
        "Privacy Settings",
      ],
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Settings,
      title: "Courses & Learning",
      description: "Everything about courses and learning",
      articles: [
        "Enrolling in Courses",
        "Course Navigation",
        "Submitting Assignments",
        "Tracking Progress",
      ],
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: CreditCard,
      title: "Payments & Billing",
      description: "Payment and subscription help",
      articles: [
        "Payment Methods",
        "Refund Policy",
        "Subscription Management",
        "Invoice Requests",
      ],
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "Keep your account secure",
      articles: [
        "Two-Factor Authentication",
        "Privacy Settings",
        "Data Protection",
        "Reporting Issues",
      ],
      color: "bg-red-100 text-red-600",
    },
    {
      icon: MessageCircle,
      title: "Community",
      description: "Connect with other learners",
      articles: [
        "Forum Guidelines",
        "Finding Study Partners",
        "Joining Discussion Groups",
        "Mentorship Programs",
      ],
      color: "bg-indigo-100 text-indigo-600",
    },
  ];

  const popularArticles = [
    {
      title: "How do I reset my password?",
      category: "Account & Profile",
      views: "2.3k",
    },
    {
      title: "Can I get a refund for a course?",
      category: "Payments & Billing",
      views: "1.8k",
    },
    {
      title: "How do I download course certificates?",
      category: "Courses & Learning",
      views: "1.5k",
    },
    {
      title: "What payment methods do you accept?",
      category: "Payments & Billing",
      views: "1.2k",
    },
    {
      title: "How do I enable two-factor authentication?",
      category: "Security & Privacy",
      views: "987",
    },
    {
      title: "Can I change my username?",
      category: "Account & Profile",
      views: "856",
    },
  ];

  const contactOptions = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      value: "support@learningplatform.com",
      action: "Send Email",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      value: "Available Mon-Fri, 9AM-6PM EST",
      action: "Start Chat",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our support team",
      value: "+1 (555) 123-4567",
      action: "Call Now",
    },
  ];

  return (
    <section className="container mx-auto py-8">
      <PageTitle
        title="Help Center"
        description="Find answers to your questions and get the support you need."
      />

      {/* Search Section */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search for help articles..."
            className="pl-12 h-12 text-lg"
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary">Getting Started</Badge>
          <Badge variant="secondary">Password Reset</Badge>
          <Badge variant="secondary">Course Access</Badge>
          <Badge variant="secondary">Billing</Badge>
          <Badge variant="secondary">Technical Issues</Badge>
        </div>
      </div>

      {/* Help Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpCategories.map((category) => (
            <Card
              key={category.title}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.articles.map((article) => (
                    <li
                      key={article}
                      className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    >
                      • {article}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Popular Articles</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {popularArticles.map((article, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b last:border-b-0 hover:bg-muted/50 px-3 rounded cursor-pointer transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">
                      {article.title}
                    </h3>
                    <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                      <span>{article.category}</span>
                      <span>•</span>
                      <span>{article.views} views</span>
                    </div>
                  </div>
                  <div className="text-muted-foreground">→</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Report a Problem</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Found something that does not work as expected?
              </p>
              <Badge variant="outline">Report Issue</Badge>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Request a Feature</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Have an idea to improve our platform?
              </p>
              <Badge variant="outline">Suggest Feature</Badge>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">System Status</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Check if all systems are operational
              </p>
              <Badge variant="outline">Check Status</Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Support */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Still Need Help?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactOptions.map((option) => (
            <Card
              key={option.title}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <option.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{option.title}</h3>
                </div>
                <p className="text-muted-foreground mb-3">
                  {option.description}
                </p>
                <p className="text-sm font-medium mb-4">{option.value}</p>
                <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                  {option.action}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">
                How do I get started with the platform?
              </h3>
              <p className="text-muted-foreground">
                Getting started is easy! Simply create an account, browse our
                course catalog, and enroll in courses that interest you. Our
                dashboard will guide you through the learning process.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">
                Can I access courses offline?
              </h3>
              <p className="text-muted-foreground">
                Currently, courses require an internet connection. However, you
                can download course materials for offline viewing through our
                mobile app.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Do you offer certificates?</h3>
              <p className="text-muted-foreground">
                Yes! Upon successful completion of most courses, you will
                receive a certificate of completion that you can add to your
                resume or LinkedIn profile.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HelpCenter;
