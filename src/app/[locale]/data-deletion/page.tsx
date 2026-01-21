import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Deletion | Sully Ruiz Real Estate',
  description: 'How to request deletion of your personal data',
};

export default function DataDeletionPage() {
  return (
    <main className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto prose prose-slate">
        <h1>Data Deletion Instructions</h1>
        <p className="text-sm text-gray-500">Last updated: January 21, 2026</p>

        <h2>How to Request Data Deletion</h2>
        <p>
          If you would like to request the deletion of your personal data from Sully Ruiz Real Estate,
          you can do so by following the instructions below.
        </p>

        <h2>Option 1: Email Request</h2>
        <p>
          Send an email to <a href="mailto:realtor@sullyruiz.com">realtor@sullyruiz.com</a> with
          the subject line &quot;Data Deletion Request&quot; and include the following information:
        </p>
        <ul>
          <li>Your full name</li>
          <li>Email address associated with your data</li>
          <li>Phone number (if applicable)</li>
          <li>Description of the data you want deleted</li>
        </ul>

        <h2>Option 2: Written Request</h2>
        <p>You may also send a written request to:</p>
        <address className="not-italic bg-gray-50 p-4 rounded-lg">
          Sully Ruiz Real Estate<br />
          Data Deletion Request<br />
          Austin, Texas
        </address>

        <h2>What Happens Next</h2>
        <p>Upon receiving your request, we will:</p>
        <ol>
          <li>Verify your identity to protect your privacy</li>
          <li>Locate all personal data associated with your request</li>
          <li>Delete the data from our systems within 30 days</li>
          <li>Send you confirmation once the deletion is complete</li>
        </ol>

        <h2>Data We May Have</h2>
        <p>The types of data we may have collected include:</p>
        <ul>
          <li>Contact information (name, email, phone number)</li>
          <li>Inquiry details and communications</li>
          <li>Property preferences and search history</li>
        </ul>

        <h2>Facebook/Instagram Data</h2>
        <p>
          If you connected with us through Facebook or Instagram, you can also manage your data
          directly through those platforms:
        </p>
        <ul>
          <li>
            <a href="https://www.facebook.com/settings?tab=applications" target="_blank" rel="noopener noreferrer">
              Facebook App Settings
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/accounts/manage_access/" target="_blank" rel="noopener noreferrer">
              Instagram Website Permissions
            </a>
          </li>
        </ul>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about the data deletion process, please contact us at{' '}
          <a href="mailto:realtor@sullyruiz.com">realtor@sullyruiz.com</a>.
        </p>
      </div>
    </main>
  );
}
