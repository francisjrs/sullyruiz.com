import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Sully Ruiz Real Estate',
  description: 'Privacy Policy for Sully Ruiz Real Estate services',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto prose prose-slate">
        <h1>Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last updated: January 21, 2026</p>

        <h2>Introduction</h2>
        <p>
          Sully Ruiz Real Estate (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy and is
          committed to protecting your personal data. This privacy policy explains how we collect,
          use, and safeguard your information when you visit our website or use our services.
        </p>

        <h2>Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li><strong>Contact Information:</strong> Name, email address, phone number when you submit inquiries</li>
          <li><strong>Usage Data:</strong> Information about how you interact with our website</li>
          <li><strong>Communications:</strong> Messages you send us through contact forms</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Respond to your real estate inquiries</li>
          <li>Provide you with property information and market updates</li>
          <li>Improve our website and services</li>
          <li>Send you relevant communications (with your consent)</li>
        </ul>

        <h2>Social Media Integration</h2>
        <p>
          Our website may integrate with social media platforms including Instagram and Facebook
          for marketing purposes. We use the Instagram Content Publishing API to share real estate
          content. This integration does not collect personal data from your social media accounts.
        </p>

        <h2>Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information against
          unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h2>Third-Party Services</h2>
        <p>We may use third-party services that collect and process data, including:</p>
        <ul>
          <li>Meta (Facebook/Instagram) for social media marketing</li>
          <li>Google Analytics for website analytics</li>
          <li>Email service providers for communications</li>
        </ul>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Request access to your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt-out of marketing communications</li>
        </ul>

        <h2>Contact Us</h2>
        <p>
          If you have questions about this privacy policy or our data practices, please contact us at:
        </p>
        <p>
          <strong>Sully Ruiz Real Estate</strong><br />
          Email: realtor@sullyruiz.com<br />
          Austin, Texas
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify you of any changes
          by posting the new policy on this page and updating the &quot;Last updated&quot; date.
        </p>
      </div>
    </main>
  );
}
