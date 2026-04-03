import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Learning",
      links: [
        { name: "Courses", href: ROUTES.COURSES },
        { name: "Projects", href: ROUTES.PROJECTS },
        { name: "Achievements", href: ROUTES.ACHIEVEMENTS },
        { name: "Leaderboard", href: ROUTES.LEADERBOARD },
      ],
    },
    {
      title: "Community",
      links: [
        { name: "Students", href: ROUTES.STUDENTS },
        { name: "Profile", href: ROUTES.PROFILE },
        { name: "About Us", href: "#" },
        { name: "Contact", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: ROUTES.HELP },
        { name: "Documentation", href: "#" },
        { name: "Terms of Service", href: ROUTES.TERMS },
        { name: "Privacy Policy", href: ROUTES.PRIVACY },
      ],
    },
  ];

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "#", label: "Email" },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  LMS
                </span>
              </div>
              <span className="font-bold text-xl">Learning Platform</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Empowering learners worldwide with quality courses, hands-on
              projects, and a supportive community.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">
            {currentYear} Learning Platform. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link
              href={ROUTES.TERMS}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href={ROUTES.PRIVACY}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href={ROUTES.COOKIES}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
