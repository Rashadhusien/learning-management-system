import SectionTitle from "@/components/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyPolicy = () => {
  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <section className="container mx-auto py-8">
      <SectionTitle
        title="Privacy Policy"
        description="How we collect, use, and protect your personal information."
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-6">
              Last updated: {lastUpdated}
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Personal Information</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Name, email address, and username</li>
                    <li>Profile information and bio</li>
                    <li>Profile picture and avatar</li>
                    <li>Academic and professional background</li>
                  </ul>

                  <h3 className="text-lg font-medium text-foreground">Learning Data</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Course enrollment and completion data</li>
                    <li>Project submissions and grades</li>
                    <li>Achievements and progress tracking</li>
                    <li>Learning patterns and analytics</li>
                  </ul>

                  <h3 className="text-lg font-medium text-foreground">Technical Data</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>IP address and device information</li>
                    <li>Browser type and operating system</li>
                    <li>Cookies and similar tracking technologies</li>
                    <li>Usage patterns and session data</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Provide and maintain our learning platform</li>
                  <li>Personalize your learning experience</li>
                  <li>Process course enrollments and certificates</li>
                  <li>Track your progress and achievements</li>
                  <li>Communicate with you about your account and courses</li>
                  <li>Improve our services and develop new features</li>
                  <li>Analyze usage patterns to optimize the platform</li>
                  <li>Ensure platform security and prevent fraud</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    We do not sell your personal information. We only share your data in the following circumstances:
                  </p>
                  
                  <h3 className="text-lg font-medium text-foreground">Public Information</h3>
                  <p className="text-muted-foreground">
                    Your name, username, profile picture, and achievements are visible to other users on the platform 
                    and in public leaderboards.
                  </p>

                  <h3 className="text-lg font-medium text-foreground">Service Providers</h3>
                  <p className="text-muted-foreground">
                    We share information with third-party service providers who help us operate our platform, such as 
                    cloud hosting, payment processing, and analytics services.
                  </p>

                  <h3 className="text-lg font-medium text-foreground">Legal Requirements</h3>
                  <p className="text-muted-foreground">
                    We may disclose your information if required by law or in good faith belief that such disclosure 
                    is necessary to comply with legal obligations.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction. These include:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>SSL/TLS encryption for all data transmissions</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Access controls and authentication systems</li>
                  <li>Secure data storage and backup procedures</li>
                  <li>Employee training on data protection</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Cookies and Tracking</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    We use cookies and similar technologies to enhance your experience on our platform:
                  </p>
                  
                  <h3 className="text-lg font-medium text-foreground">Essential Cookies</h3>
                  <p className="text-muted-foreground">
                    Required for basic site functionality, such as login authentication and shopping cart contents.
                  </p>

                  <h3 className="text-lg font-medium text-foreground">Analytics Cookies</h3>
                  <p className="text-muted-foreground">
                    Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>

                  <h3 className="text-lg font-medium text-foreground">Preference Cookies</h3>
                  <p className="text-muted-foreground">
                    Remember your settings and preferences, such as language and theme choices.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Delete your account and personal data</li>
                  <li>Object to processing of your information</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent where processing is based on consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal information only as long as necessary to fulfill the purposes outlined 
                  in this privacy policy, unless a longer retention period is required or permitted by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our service is not intended for children under 13 years of age. We do not knowingly collect 
                  personal information from children under 13. If we become aware that we have collected personal 
                  information from a child under 13, we will take steps to delete such information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your personal information may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place to protect your data in accordance with applicable 
                  data protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this privacy policy from time to time. We will notify you of any changes by 
                  posting the new privacy policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;
