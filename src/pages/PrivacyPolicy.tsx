const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-6">Last updated: March 23, 2026</p>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">1. Introduction</h2>
          <p>
            This Privacy Policy describes how the Short-Term Memory Test research project
            ("we," "us," or "our") collects, uses, and protects your personal information
            when you participate in our cognitive assessment. By participating, you agree to
            the practices described in this policy.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">2. Information We Collect</h2>
          <p>We collect the following information during your participation:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Nickname:</strong> A self-chosen identifier used to associate your test results. This is not required to be your real name.</li>
            <li><strong>Test Responses:</strong> Your answers to pattern recognition, digit span, and word recall tasks.</li>
            <li><strong>Performance Data:</strong> Timing information and accuracy scores derived from your responses.</li>
            <li><strong>Session Metadata:</strong> Timestamps and session identifiers generated during your participation.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">3. How We Use Your Information</h2>
          <p>Your information is used exclusively for:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Academic research on short-term memory and cognitive function.</li>
            <li>Aggregate statistical analysis for educational purposes.</li>
            <li>Fulfillment of coursework and research requirements at De La Salle University.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">4. Data Storage and Security</h2>
          <p>
            Your data is stored securely using encrypted cloud infrastructure. We implement
            appropriate technical and organizational measures to protect your information
            against unauthorized access, alteration, disclosure, or destruction. Access to
            individual results is restricted to authorized research moderators only.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">5. Data Retention</h2>
          <p>
            Your data will be retained for the duration of the research project and any
            subsequent academic review period. After the research is concluded and all
            academic requirements are fulfilled, data may be anonymized or deleted at the
            discretion of the research team.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">6. Data Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. Your
            data may be included in aggregate, anonymized form in academic publications or
            presentations. Individual responses will not be publicly identifiable.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Request access to the personal data we hold about you.</li>
            <li>Request correction or deletion of your data.</li>
            <li>Withdraw your participation at any time before completing the test.</li>
            <li>Ask questions about how your data is used.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">8. Children's Privacy</h2>
          <p>
            This test is not intended for individuals under the age of 18 without parental
            or guardian consent. We do not knowingly collect data from minors without
            appropriate authorization.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be
            reflected on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">10. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or your data,
            please contact us at:{" "}
            <a
              href="mailto:katherina_fischeder@dlsu.edu.ph"
              className="text-foreground underline hover:opacity-70 transition-opacity"
            >
              katherina_fischeder@dlsu.edu.ph
            </a>
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-muted">
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Test
        </a>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
