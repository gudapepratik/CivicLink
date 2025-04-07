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
 * Sends an email to notify a user that their report has been verified.
 * @param {string} email - Recipient's email.
 * @param {string} name - Recipient's name.
 * @param {string} reportTitle - Title of the report.
 * @param {string} reportId - Report ID.
 */
export const sendReportVerifiedEmail = (email, name, reportTitle, reportId) => {
  const templateId = 3; // Replace with the actual template ID from Brevo
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
 * Sends an email to notify a user about a report status update.
 * @param {string} email - Recipient's email.
 * @param {string} name - Recipient's name.
 * @param {string} reportTitle - Title of the report.
 * @param {string} reportId - Report ID.
 * @param {string} status - New status of the report (e.g., "In Progress", "Resolved", "Rejected").
 */
export const sendReportStatusUpdateEmail = (email, name, reportTitle, reportId, status) => {
  const subject = `Update: Your Report Status Changed to ${status}`;
  const htmlContent = `
    <body>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
        .container { max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9; }
        .btn { display: inline-block; padding: 10px 20px; background-color: #003994; color: #ffffff; text-decoration: none; border-radius: 5px; }
      </style>
      <div class="container">
        <h2>Report Status Updated</h2>
        <p>Hello ${name},</p>
        <p>Your report <strong>"${reportTitle}"</strong> has been updated to <strong>${status}</strong>.</p>
        <a href="https://civic-link.vercel.app/explore-posts/${reportId}" class="btn">View Report</a>
        <p>Thank you for being an active citizen!</p>
      </div>
    </body>
  `;
  return sendTemplateEmail(email, subject, htmlContent);
};


/**
 * Sends an email when an authority user's account is pending approval.
 * @param {string} email - Recipient's email.
 * @param {string} name - Recipient's name.
 */
export const sendAccountPendingApprovalEmail = (email, name) => {
  const subject = "Your Authority Account is Pending Approval";
  const htmlContent = `
    <body>
      <style> ... </style>
      <div class="container">
        <h2>Account Pending Approval</h2>
        <p>Hello ${name},</p>
        <p>Your authority account has been created and is pending approval by the admin. You will be notified once it is reviewed.</p>
        <p>Thank you for your patience!</p>
      </div>
    </body>
  `;
  return sendTemplateEmail(email, subject, htmlContent);
};


/**
 * Sends an email when an authority user's account is rejected.
 * @param {string} email - Recipient's email.
 * @param {string} name - Recipient's name.
 * @param {string} reason - Reason for rejection.
 */
export const sendAccountRejectedEmail = (email, name, reason) => {
  const subject = "Your Authority Account Application Was Rejected";
  const htmlContent = `
    <body>
      <style> ... </style>
      <div class="container">
        <h2>Account Rejected</h2>
        <p>Hello ${name},</p>
        <p>Your authority account application was reviewed but has been rejected for the following reason:</p>
        <p><strong>${reason}</strong></p>
        <p>If you believe this was a mistake, please contact support.</p>
      </div>
    </body>
  `;
  return sendTemplateEmail(email, subject, htmlContent);
};

export const sendNewCommentEmail = (email, name, reportTitle, reportId, commenterName) => {
  const subject = "Someone Commented on Your Report!";
  const htmlContent = `
    <body>
      <style> ... </style>
      <div class="container">
        <h2>New Comment on Your Report</h2>
        <p>Hello ${name},</p>
        <p><strong>${commenterName}</strong> has commented on your report <strong>"${reportTitle}"</strong>.</p>
        <p>Check out the discussion and respond if needed.</p>
        <a href="https://civic-link.vercel.app/explore-posts/${reportId}" class="btn">View Comment</a>
      </div>
    </body>
  `;
  return sendTemplateEmail(email, subject, htmlContent);
};

export const sendReportResolvedEmail = (email, name, reportTitle, reportId) => {
  const subject = "Your Report Has Been Resolved!";
  const htmlContent = `
    <body>
      <style> ... </style>
      <div class="container">
        <h2>Issue Resolved!</h2>
        <p>Hello ${name},</p>
        <p>Your reported issue <strong>"${reportTitle}"</strong> has been marked as resolved by the authorities.</p>
        <p>We appreciate your contribution to the community!</p>
        <a href="https://civic-link.vercel.app/explore-posts/${reportId}" class="btn">View Report</a>
      </div>
    </body>
  `;
  return sendTemplateEmail(email, subject, htmlContent);
};

export const sendReportRejectedEmail = (email, name, reportTitle, reportId, reason) => {
  const subject = "Your Report Has Been Rejected";
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
        <h2>Your Report Has Been Rejected</h2>
        <p>Hello ${name},</p>
        <p>Your report <strong>"${reportTitle}"</strong> has been reviewed by our team but unfortunately, it has been rejected.</p>
        <p>If you believe this decision was made in error, you may submit a new report with accurate details.</p>
        <a href="https://civic-link.vercel.app/new-post" class="btn">Submit New Report</a>
      </div>
    </body>
  `;
  return sendTemplateEmail(email, subject, htmlContent);
};

/**
 * Sends an email when a report is created successfully and is awaiting admin approval.
 * @param {string} email - Recipient's email.
 * @param {string} name - Recipient's name.
 * @param {string} reportTitle - Title of the report.
 * @param {string} reportId - Report ID.
 */
export const sendReportPendingApprovalEmail = (email, name, reportTitle, reportId) => {
  const subject = "Your Report is Waiting for Approval";
  const htmlContent = `
    <body>
      <style> ... </style>
      <div class="container">
        <h2>Report Created Successfully!</h2>
        <p>Hello ${name},</p>
        <p>Your report <strong>"${reportTitle}"</strong> has been submitted and is currently under review by an admin.</p>
        <p>Once approved, it will be visible on CivicLink.</p>
        <p>Thank you for making a difference!</p>
      </div>
    </body>
  `;
  return sendTemplateEmail(email, subject, htmlContent);
};

/**
 * Sends an email to the user with their verification code.
 * @param {string} email - Recipient's email.
 * @param {string} name - Recipient's name.
 * @param {string} verificationCode - The verification code.
 */
export const sendVerificationCodeEmail = (email, name, verificationCode) => {
  const subject = "Your CivicLink Verification Code";
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
        .code {
          font-size: 24px;
          font-weight: bold;
          background-color: #003994;
          color: #ffffff;
          padding: 10px 20px;
          border-radius: 6px;
          display: inline-block;
          margin: 20px 0;
        }
      </style>

      <div class="container">
        <h2>Email Verification for Password Change</h2>
        <p>Hello ${name},</p>
        <p>Use the verification code below to verify your CivicLink account:</p>
        <div class="code">${verificationCode}</div>
        <p>This code will expire in 2 days. If you did not request this, please ignore the email.</p>
      </div>
    </body>
  `;

  return sendTemplateEmail(email, subject, htmlContent);
};

/**
 * Sends an email to notify the citizen that their CivicLink account has been successfully created.
 * @param {string} email - Recipient's email.
 * @param {string} name - Recipient's name.
 */
export const sendCitizenAccountCreatedEmail = (email, name) => {
  const subject = "Welcome to CivicLink - Your Account is Ready!";
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
        <h2>Welcome to CivicLink!</h2>
        <p>Hello ${name},</p>
        <p>
          Your Citizen account has been successfully created on CivicLink. You can now log in and start reporting issues in your community.
        </p>
        <a href="https://civic-link.vercel.app/login" class="btn">
          Login Now
        </a>
        <p>We're excited to have you on board!</p>
      </div>
    </body>
  `;

  return sendTemplateEmail(email, subject, htmlContent);
};


/**
 * Sends an email to notify the authority/admin that their CivicLink account has been created and is pending verification.
 * @param {string} email - Recipient's email.
 * @param {string} name - Recipient's name.
 * @param {string} role - User's role (Authority or Admin).
 */
export const sendAuthorityAccountCreatedEmail = (email, name, role) => {
  const subject = "CivicLink Account Created - Pending Verification";
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
        <h2>Account Created Successfully!</h2>
        <p>Hello ${name},</p>
        <p>
          Your ${role} account has been created on CivicLink. Our admin team will review your application shortly.
        </p>
        <p>
          Once verified, you'll receive another email confirming access to the platform.
        </p>
        <p>Thank you for supporting your community through CivicLink!</p>
      </div>
    </body>
  `;

  return sendTemplateEmail(email, subject, htmlContent);
};


/**
 * Sends an email to notify the user that their CivicLink account has been verified by an admin.
 * @param {string} email - Recipient's email.
 * @param {string} name - Recipient's name.
 * @param {string} verificationCode - The verification code for the user.
 */
export const sendAccountVerifiedEmail = (email, name, verificationCode) => {
  const subject = "Your CivicLink Account Has Been Verified by Admin";
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
          margin-top: 15px;
        }
        .code {
          background-color: #eee;
          display: inline-block;
          padding: 10px 20px;
          border-radius: 5px;
          font-weight: bold;
          font-size: 18px;
          margin-top: 10px;
        }
      </style>

      <div class="container">
        <h2>Account Verified by Admin</h2>
        <p>Hello ${name},</p>
        <p>
          We are pleased to inform you that your CivicLink account has been verified by our admin team.
        </p>
        <p>Your verification code is:</p>
        <div class="code">${verificationCode}</div>
        <p>Please use this code if prompted while logging in or managing your account.</p>
        <a href="https://civic-link.vercel.app/login" class="btn">Login Now</a>
        <p>Thank you for being a part of CivicLink!</p>
      </div>
    </body>
  `;

  return sendTemplateEmail(email, subject, htmlContent);
};
