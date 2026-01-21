import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Sully Ruiz Real Estate',
  description: 'Terms of Service for Sully Ruiz Real Estate website',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto prose prose-slate">
        <h1>Terms of Service</h1>
        <p className="text-sm text-gray-500">Last updated: January 21, 2026</p>

        <h2>Agreement to Terms</h2>
        <p>
          By accessing or using the Sully Ruiz Real Estate website, you agree to be bound by these
          Terms of Service. If you do not agree with any part of these terms, you may not access
          the website.
        </p>

        <h2>Services</h2>
        <p>
          Sully Ruiz Real Estate provides real estate services in the Austin, Texas area. Our
          website offers information about our services, property listings, market insights, and
          contact capabilities.
        </p>

        <h2>Use of Website</h2>
        <p>You agree to use this website only for lawful purposes and in a way that does not:</p>
        <ul>
          <li>Infringe on the rights of others</li>
          <li>Restrict or inhibit anyone else&apos;s use of the website</li>
          <li>Violate any applicable laws or regulations</li>
          <li>Transmit harmful or malicious code</li>
        </ul>

        <h2>Intellectual Property</h2>
        <p>
          The content on this website, including text, images, logos, and graphics, is the property
          of Sully Ruiz Real Estate and is protected by copyright and other intellectual property
          laws. You may not reproduce, distribute, or create derivative works without our written
          permission.
        </p>

        <h2>User Submissions</h2>
        <p>
          When you submit information through our contact forms or other means, you grant us the
          right to use that information to respond to your inquiries and provide our services.
        </p>

        <h2>Disclaimer</h2>
        <p>
          The information provided on this website is for general informational purposes only.
          While we strive to keep the information accurate and up-to-date, we make no warranties
          about the completeness, reliability, or accuracy of this information.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          Sully Ruiz Real Estate shall not be liable for any indirect, incidental, special, or
          consequential damages arising from your use of this website or our services.
        </p>

        <h2>Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites. We are not responsible for the
          content or privacy practices of these external sites.
        </p>

        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Changes will be effective
          immediately upon posting to the website. Your continued use of the website after changes
          constitutes acceptance of the modified terms.
        </p>

        <h2>Contact</h2>
        <p>
          For questions about these Terms of Service, please contact us at:
        </p>
        <p>
          <strong>Sully Ruiz Real Estate</strong><br />
          Email: realtor@sullyruiz.com<br />
          Austin, Texas
        </p>
      </div>
    </main>
  );
}
