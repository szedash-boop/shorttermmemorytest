const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-6">Last updated: March 23, 2026</p>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing and participating in the Short-Term Memory Test ("the Test"), you
            acknowledge that you have read, understood, and agree to be bound by these Terms
            of Service. If you do not agree to these terms, please do not participate.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">2. Nature of the Test</h2>
          <p>
            The Test is a cognitive assessment tool developed for academic research purposes
            at De La Salle University. It is designed to measure aspects of short-term memory
            through pattern recognition, digit span, and word recall tasks. The Test is not a
            diagnostic tool and should not be used as a substitute for professional
            psychological or medical evaluation.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">3. Eligibility</h2>
          <p>
            Participation in the Test is open to individuals who have received a valid access
            code. Participants under 18 years of age must have parental or guardian consent
            before participating.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">4. Voluntary Participation</h2>
          <p>
            Your participation is entirely voluntary. You may withdraw at any time before
            completing the Test by closing your browser. However, once the Test is completed
            and results are submitted, your responses will be recorded as part of the research
            dataset.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">5. Proper Use</h2>
          <p>You agree to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Provide honest and genuine responses during the Test.</li>
            <li>Not attempt to manipulate, reverse-engineer, or interfere with the Test's functionality.</li>
            <li>Not share your access code with unauthorized individuals.</li>
            <li>Not reproduce, distribute, or publicly display the Test content without written permission.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">6. Intellectual Property</h2>
          <p>
            All content, design, and materials within the Test, including but not limited to
            test items, visual patterns, and interface design, are the intellectual property
            of the research team. Unauthorized reproduction or distribution is prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">7. Disclaimer of Warranties</h2>
          <p>
            The Test is provided "as is" without warranties of any kind, either express or
            implied. We do not guarantee that the Test will be uninterrupted, error-free, or
            compatible with all devices or browsers. We are not responsible for any technical
            issues that may affect your participation.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">8. Limitation of Liability</h2>
          <p>
            In no event shall the research team, De La Salle University, or any affiliated
            parties be liable for any indirect, incidental, special, or consequential damages
            arising from your participation in the Test, including but not limited to loss of
            data or interruption of service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">9. Confidentiality of Results</h2>
          <p>
            Individual test results are confidential and accessible only to authorized
            research moderators. Results will not be shared with participants. Aggregate,
            anonymized data may be used in academic publications and presentations.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">10. Modifications</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Continued
            participation after changes constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">11. Governing Law</h2>
          <p>
            These Terms of Service shall be governed by and construed in accordance with the
            laws of the Republic of the Philippines.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">12. Contact</h2>
          <p>
            For questions regarding these Terms of Service, please contact:{" "}
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

export default TermsOfService;
