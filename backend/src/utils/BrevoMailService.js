import axios from "axios";

const BREVO_API_KEY = process.env.BREVO_API_KEY; // Store API Key in environment variables
const SENDER_EMAIL = "civiclink.business@gmail.com"; // Update with your sender email

const brevoAPI = axios.create({
  baseURL: "https://api.brevo.com/v3/smtp/email",
  headers: {
    accept: "application/json",
    "api-key": BREVO_API_KEY,
    "content-type": "application/json",
  },
});

const sendTemplateEmail = async (to, subject, htmlContent) => {
  try {
    const response = await brevoAPI.post("", {
      sender: { email: SENDER_EMAIL, name: "CivicLink" },
      to: [{ email: to }],
      subject,
      htmlContent, // This will replace dynamic placeholders in the template
    });
    console.log(`✅ Email sent to ${to}: ${response.status}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Sends an account verification email using a Brevo template.
 * @param {string} email - Recipient's email.
 * @param {string} name - Recipient's name.
 */
export const sendAccountVerificationEmail = (email, name) => {
  const templateId = 2; // Replace with the actual template ID from Brevo
  const params = { name }; // Make sure your template has a {{name}} placeholder

  return sendTemplateEmail(email, templateId, params);
};

/**
 * Sends an email to notify a user that their report has been verified.
 * @param {string} email - Recipient's email.
 * @param {string} name - Recipient's name.
 * @param {string} reportTitle - Title of the report.
 * @param {string} reportId - Report ID.
 */
export const sendReportVerifiedEmail = (email, name, reportTitle, reportId) => {
  const templateId = 3; // Replace with the actual template ID from Brevo
//   const params = {
//     name,
//     report_title: reportTitle,
//     report_id: reportId, // Ensure this matches the template variable
//   };
const subject = "Your Report is Live on CivicLink!"
const htmlContent = `
    <body>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          text-align: center;
        }
        .container {
          max-width: 600px;
          margin: auto;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .btn {
          display: inline-block;
          padding: 10px 20px;
          background-color: #003994;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
        }
      </style>

      <div class="container">
        <h2>Your Report is Live!</h2>
        <p>Hello ${name},</p>
        <p>
          Your report <strong>"${reportTitle}"</strong> has been reviewed and
          verified. It is now visible on <strong>CivicLink</strong>, and authorities
          can take necessary actions.
        </p>
        <a href="https://civic-link.vercel.app/explore-posts/${reportId}" class="btn">
          View Report
        </a>
        <p>Thank you for contributing to a better community!</p>
      </div>
    </body>
  `;

  return sendTemplateEmail(email, subject, htmlContent);
};

/**
 * Sends an email to notify a user that their report has been rejected.
 * @param {string} email - Recipient's email.
 * @param {string} name - Recipient's name.
 * @param {string} reportTitle - Title of the report.
 * @param {string} rejectionReason - Reason for rejection.
 */
export const sendReportRejectedEmail = (email, name, reportTitle, rejectionReason) => {
  const templateId = 4; // Replace with the actual template ID from Brevo
  const params = { name, reportTitle, rejectionReason };

  return sendTemplateEmail(email, templateId, params);
};
