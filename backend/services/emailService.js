const fetch = require('isomorphic-fetch');
const { Client } = require('@microsoft/microsoft-graph-client');
const { ClientSecretCredential } = require('@azure/identity');

const tenantId = process.env.MS_TENANT_ID;
const clientId = process.env.MS_CLIENT_ID;
const clientSecret = process.env.MS_CLIENT_SECRET;
const senderEmail = process.env.EMAIL_USER;

// Authenticate using client credentials (no user interaction)
const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

const graphClient = Client.initWithMiddleware({
  authProvider: {
    getAccessToken: async () => {
      const tokenResponse = await credential.getToken('https://graph.microsoft.com/.default');
      return tokenResponse.token;
    }
  }
});

/**
 * Send an email via Microsoft Graph API (application permission)
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body (plain text)
 */
const sendEmail = async (to, subject, text) => {
  try {
    const message = {
      message: {
        subject,
        body: {
          contentType: 'Text',
          content: text
        },
        toRecipients: [
          { emailAddress: { address: to } }
        ]
      },
      saveToSentItems: 'false'
    };

    await graphClient.api(`/users/${senderEmail}/sendMail`).post(message);

    console.log(`Email sent successfully to ${to}`);
  } catch (err) {
    console.error('Failed to send email:', err);
    throw err;
  }
};

module.exports = sendEmail;