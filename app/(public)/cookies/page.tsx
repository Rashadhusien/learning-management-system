import PageTitle from "@/components/PageTitle";
import { Card, CardContent } from "@/components/ui/card";

const CookiePolicy = () => {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="container mx-auto py-8">
      <PageTitle
        title="Cookie Policy"
        description="How we use cookies and similar technologies on our learning platform."
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-6">
              Last updated: {lastUpdated}
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  1. What Are Cookies
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Cookies are small text files that are stored on your device
                  (computer, tablet, or mobile) when you visit a website. They
                  help the website remember information about your visit, which
                  can make it easier to visit the site again and make the site
                  more useful to you.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  2. How We Use Cookies
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use cookies for several purposes to enhance your experience
                  on our learning platform:
                </p>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">
                    Essential Cookies
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies are necessary for the website to function:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Authentication and login status</li>
                    <li>Shopping cart contents for course purchases</li>
                    <li>Security tokens and fraud prevention</li>
                    <li>Load balancing and site stability</li>
                  </ul>

                  <h3 className="text-lg font-medium text-foreground">
                    Performance Cookies
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies help us understand how our website performs:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Page load times and performance metrics</li>
                    <li>Error tracking and debugging</li>
                    <li>Server response monitoring</li>
                  </ul>

                  <h3 className="text-lg font-medium text-foreground">
                    Functional Cookies
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies enhance functionality and personalization:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Remembering your preferences and settings</li>
                    <li>Language and theme selections</li>
                    <li>Course progress and bookmarks</li>
                    <li>Customized content recommendations</li>
                  </ul>

                  <h3 className="text-lg font-medium text-foreground">
                    Analytics Cookies
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies help us understand user behavior:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Pages visited and time spent on site</li>
                    <li>User journey and navigation patterns</li>
                    <li>Course engagement metrics</li>
                    <li>Device and browser statistics</li>
                  </ul>

                  <h3 className="text-lg font-medium text-foreground">
                    Marketing Cookies
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies are used for advertising and marketing:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Personalized advertisements</li>
                    <li>Campaign effectiveness tracking</li>
                    <li>Cross-site behavioral tracking</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  3. Third-Party Cookies
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use third-party services that may place cookies on your
                  device:
                </p>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-foreground">
                      Google Analytics
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Used for website analytics and user behavior tracking
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Cloudinary</h4>
                    <p className="text-muted-foreground text-sm">
                      Used for image and video hosting services
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">
                      Payment Processors
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Used for secure payment processing and fraud detection
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  4. Managing Your Cookie Preferences
                </h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    You have several options for managing cookies:
                  </p>

                  <h3 className="text-lg font-medium text-foreground">
                    Browser Settings
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Most browsers allow you to control cookies through their
                    settings:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Block all cookies</li>
                    <li>Block only third-party cookies</li>
                    <li>Delete existing cookies</li>
                    <li>Receive notifications when cookies are set</li>
                  </ul>

                  <h3 className="text-lg font-medium text-foreground">
                    Cookie Consent Banner
                  </h3>
                  <p className="text-muted-foreground">
                    When you first visit our site, you will see a cookie consent
                    banner where you can choose which types of cookies to
                    accept.
                  </p>

                  <h3 className="text-lg font-medium text-foreground">
                    Opt-Out Tools
                  </h3>
                  <p className="text-muted-foreground">
                    You can opt out of targeted advertising through industry
                    opt-out programs like the Digital Advertising Alliance (DAA)
                    and Network Advertising Initiative (NAI).
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  5. Impact of Disabling Cookies
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Disabling cookies may affect your experience:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>You may need to log in more frequently</li>
                  <li>Some features may not work properly</li>
                  <li>Personalized content may be limited</li>
                  <li>Shopping cart functionality may be affected</li>
                  <li>Analytics and performance tracking will be reduced</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  6. Cookie Lifespan
                </h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    Different types of cookies have different lifespans:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>
                      <strong>Session cookies:</strong> Deleted when you close
                      your browser
                    </li>
                    <li>
                      <strong>Persistent cookies:</strong> Remain on your device
                      for a set period or until deleted
                    </li>
                    <li>
                      <strong>First-party cookies:</strong> Set by our website
                      directly
                    </li>
                    <li>
                      <strong>Third-party cookies:</strong> Set by external
                      services we use
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  7. Updates to This Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this cookie policy from time to time to reflect
                  changes in our practices or applicable law. We will notify you
                  of any material changes by posting the updated policy on our
                  website and updating the effective date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about our use of cookies, please
                  contact us at:
                  <br />
                  Email: privacy@learningplatform.com
                  <br />
                  Address: 123 Education Street, Learning City, LC 12345
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CookiePolicy;
