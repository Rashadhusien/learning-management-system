import PageTitle from "@/components/PageTitle";
import { Card, CardContent } from "@/components/ui/card";

const TermsOfService = () => {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="container mx-auto py-8">
      <PageTitle
        title="Terms of Service"
        description="Please read these terms carefully before using our learning platform."
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
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using this Learning Platform, you accept and
                  agree to be bound by the terms and provision of this
                  agreement. If you do not agree to abide by the above, please
                  do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  2. Description of Service
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Our Learning Platform provides:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Access to educational courses and learning materials</li>
                  <li>Project submission and feedback systems</li>
                  <li>Achievement tracking and leaderboard functionality</li>
                  <li>Community features and student profiles</li>
                  <li>Progress monitoring and analytics</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  3. User Accounts
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    You are responsible for maintaining the confidentiality of
                    your account credentials.
                  </p>
                  <p>
                    You agree to provide accurate, current, and complete
                    information during registration.
                  </p>
                  <p>
                    You must be at least 13 years of age to create an account.
                  </p>
                  <p>
                    You are responsible for all activities that occur under your
                    account.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  4. Acceptable Use
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>
                    Use the service for any illegal or unauthorized purpose
                  </li>
                  <li>
                    Submit plagiarized or copyrighted work without proper
                    attribution
                  </li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Upload malicious code, viruses, or harmful content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  5. Intellectual Property
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    All content on the platform, including courses, materials,
                    and software, is owned by us or our content providers and is
                    protected by intellectual property laws.
                  </p>
                  <p>
                    You retain ownership of your submitted projects and
                    coursework, but grant us a license to use, display, and
                    distribute your work for educational purposes.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  6. Privacy and Data
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your privacy is important to us. Please review our Privacy
                  Policy, which also governs your use of the service, to
                  understand our practices.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  7. Payment and Refunds
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Some courses and features may require payment. All fees are
                    clearly displayed before purchase.
                  </p>
                  <p>
                    Refunds are available within 14 days of purchase if
                    you&eps;re not satisfied with the course content.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may terminate or suspend your account immediately, without
                  prior notice or liability, for any reason whatsoever,
                  including without limitation if you breach the Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  9. Limitation of Liability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall our company, nor its directors, employees,
                  partners, agents, suppliers, or affiliates, be liable for any
                  indirect, incidental, special, consequential, or punitive
                  damages, including without limitation, loss of profits, data,
                  use, goodwill, or other intangible losses.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  10. Changes to Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify or replace these Terms at any
                  time. If a revision is material, we will provide at least 30
                  days notice prior to any new terms taking effect.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  11. Contact Information
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms of Service, please
                  contact us at:
                  <br />
                  Email: support@learningplatform.com
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

export default TermsOfService;
