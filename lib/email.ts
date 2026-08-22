import nodemailer from 'nodemailer';

const TO_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'fonyechris@gmail.com';
const ORG_NAME = process.env.NEXT_PUBLIC_ORG_NAME || 'Skill to Leadership';

// Create transport dynamically if SMTP settings are present
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });
  }

  return null;
}

interface SendEmailParams {
  to?: string;
  subject: string;
  replyTo?: string;
  html: string;
  text: string;
}

export async function sendDirectEmail({
  to,
  subject,
  replyTo,
  html,
  text,
}: SendEmailParams): Promise<{ success: boolean; messageId?: string; simulated?: boolean }> {
  const recipient = to || TO_EMAIL;
  try {
    const transporter = getTransporter();

    if (!transporter) {
      console.log(`[EMAIL DISPATCH - SIMULATED] To: ${recipient} | Subject: "${subject}"`);
      console.log(`Reply-To: ${replyTo || 'None'}`);
      console.log(`Content:\n${text}`);
      return { success: true, simulated: true };
    }

    const info = await transporter.sendMail({
      from: `"${ORG_NAME}" <${process.env.SMTP_FROM || process.env.SMTP_USER || TO_EMAIL}>`,
      to: recipient,
      replyTo: replyTo || process.env.SMTP_FROM || TO_EMAIL,
      subject,
      text,
      html,
    });

    console.log(`[EMAIL DISPATCH - SENT] MessageId: ${info.messageId} to ${recipient}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EMAIL DISPATCH - ERROR] Failed to send direct email:', error);
    return { success: false };
  }
}

/**
 * Super Admin reply to an incoming contact message
 */
export async function sendAdminReplyEmail(data: {
  to: string;
  toName: string;
  subject: string;
  replyText: string;
  adminName: string;
  originalMessage?: string;
}) {
  const emailSubject = `Re: ${data.subject}`;
  const text = `
Dear ${data.toName},

${data.replyText}

---
Best regards,
${data.adminName}
${ORG_NAME}

${data.originalMessage ? `\n--- Your Original Message ---\n${data.originalMessage}` : ''}
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; color: #1e293b; border-radius: 12px; border: 1px solid #e2e8f0;">
      <div style="border-bottom: 2px solid #d4af37; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #0c1322; margin: 0; font-size: 20px; font-weight: bold;">${ORG_NAME}</h2>
      </div>
      
      <p style="font-size: 15px; color: #1e293b; line-height: 1.6;">Dear <strong>${data.toName}</strong>,</p>
      
      <div style="font-size: 15px; color: #334155; line-height: 1.7; margin: 16px 0; white-space: pre-wrap;">${data.replyText}</div>
      
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">
        <p style="margin: 0 0 4px 0; font-weight: bold; color: #0c1322;">${data.adminName}</p>
        <p style="margin: 0; color: #d4af37; font-weight: bold;">${ORG_NAME} Management</p>
      </div>

      ${data.originalMessage ? `
      <div style="margin-top: 24px; padding: 12px 16px; background-color: #f8fafc; border-left: 3px solid #cbd5e1; font-size: 13px; color: #64748b; border-radius: 4px;">
        <p style="margin: 0 0 6px 0; font-weight: bold; color: #475569;">In reply to your message:</p>
        <p style="margin: 0; white-space: pre-wrap;">${data.originalMessage}</p>
      </div>` : ''}
    </div>
  `;

  return sendDirectEmail({
    to: data.to,
    subject: emailSubject,
    replyTo: TO_EMAIL,
    html,
    text,
  });
}

/**
 * 1. Application Submission Notification
 */
export async function sendApplicationNotification(data: {
  refCode: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  location: string;
  education: string;
  skillPreference: string;
  motivation: string;
  previousExperience?: string | null;
  portfolioUrl?: string | null;
  emergencyContact: string;
}) {
  const subject = `[${ORG_NAME}] New Cohort Application [${data.refCode}] - ${data.fullName}`;
  const text = `
New Fellow Application Submitted:

Reference Code: ${data.refCode}
Applicant: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Age: ${data.age}
Location: ${data.location}
Education Level: ${data.education}
Track Preference: ${data.skillPreference}
Emergency Contact: ${data.emergencyContact}
Portfolio / Links: ${data.portfolioUrl || 'None'}

Motivation:
${data.motivation}

Prior Experience:
${data.previousExperience || 'None'}
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0c1322; color: #ffffff; border-radius: 12px; border: 1px solid #1e293b;">
      <div style="border-bottom: 1px solid #d4af37; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #d4af37; margin: 0; font-size: 20px;">New Cohort Application: ${data.refCode}</h2>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #e2e8f0;">
        <tr><td style="padding: 6px 0; color: #94a3b8; width: 140px;">Applicant Name:</td><td style="font-weight: bold; color: #ffffff;">${data.fullName}</td></tr>
        <tr><td style="padding: 6px 0; color: #94a3b8;">Email:</td><td><a href="mailto:${data.email}" style="color: #60a5fa;">${data.email}</a></td></tr>
        <tr><td style="padding: 6px 0; color: #94a3b8;">Phone:</td><td>${data.phone}</td></tr>
        <tr><td style="padding: 6px 0; color: #94a3b8;">Age:</td><td>${data.age}</td></tr>
        <tr><td style="padding: 6px 0; color: #94a3b8;">Location:</td><td>${data.location}</td></tr>
        <tr><td style="padding: 6px 0; color: #94a3b8;">Selected Track:</td><td style="color: #d4af37; font-weight: bold;">${data.skillPreference}</td></tr>
        <tr><td style="padding: 6px 0; color: #94a3b8;">Education:</td><td>${data.education}</td></tr>
        <tr><td style="padding: 6px 0; color: #94a3b8;">Emergency Contact:</td><td>${data.emergencyContact}</td></tr>
        ${data.portfolioUrl ? `<tr><td style="padding: 6px 0; color: #94a3b8;">Portfolio / Link:</td><td><a href="${data.portfolioUrl}" style="color: #60a5fa;">${data.portfolioUrl}</a></td></tr>` : ''}
      </table>
      <div style="margin-top: 20px; padding: 16px; background-color: #151e32; border-left: 4px solid #d4af37; border-radius: 6px;">
        <h4 style="margin: 0 0 8px 0; color: #d4af37; font-size: 13px; text-transform: uppercase;">Motivation & Goals:</h4>
        <p style="margin: 0; color: #f8fafc; font-size: 14px; white-space: pre-wrap; line-height: 1.6;">${data.motivation}</p>
      </div>
      ${data.previousExperience ? `
      <div style="margin-top: 16px; padding: 16px; background-color: #151e32; border-left: 4px solid #38bdf8; border-radius: 6px;">
        <h4 style="margin: 0 0 8px 0; color: #38bdf8; font-size: 13px; text-transform: uppercase;">Previous Experience:</h4>
        <p style="margin: 0; color: #f8fafc; font-size: 14px; white-space: pre-wrap; line-height: 1.6;">${data.previousExperience}</p>
      </div>` : ''}
    </div>
  `;

  return sendDirectEmail({
    to: TO_EMAIL,
    subject,
    replyTo: data.email,
    html,
    text,
  });
}

/**
 * 2. Volunteer Application Notification
 */
export async function sendVolunteerNotification(data: {
  fullName: string;
  email: string;
  phone: string;
  rolePreference: string;
  bio: string;
  linkedin?: string | null;
  availability: string;
}) {
  const subject = `[${ORG_NAME}] New Volunteer Application: ${data.fullName} (${data.rolePreference})`;
  const text = `
New Volunteer / Mentor Application:

Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Preferred Role: ${data.rolePreference}
Availability: ${data.availability}
LinkedIn: ${data.linkedin || 'Not provided'}

Bio / Experience:
${data.bio}
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0c1322; color: #ffffff; border-radius: 12px; border: 1px solid #1e293b;">
      <div style="border-bottom: 1px solid #d4af37; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #d4af37; margin: 0; font-size: 20px;">New Volunteer & Mentor Registration</h2>
      </div>
      <p style="font-size: 15px; color: #e2e8f0; line-height: 1.6;"><strong>Applicant:</strong> ${data.fullName}</p>
      <p style="font-size: 15px; color: #e2e8f0; line-height: 1.6;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #60a5fa;">${data.email}</a></p>
      <p style="font-size: 15px; color: #e2e8f0; line-height: 1.6;"><strong>Phone:</strong> ${data.phone}</p>
      <p style="font-size: 15px; color: #e2e8f0; line-height: 1.6;"><strong>Role:</strong> <span style="color: #d4af37; font-weight: bold;">${data.rolePreference}</span></p>
      <p style="font-size: 15px; color: #e2e8f0; line-height: 1.6;"><strong>Availability:</strong> ${data.availability}</p>
      ${data.linkedin ? `<p style="font-size: 15px; color: #e2e8f0; line-height: 1.6;"><strong>LinkedIn:</strong> <a href="${data.linkedin}" style="color: #60a5fa;">${data.linkedin}</a></p>` : ''}
      <div style="margin-top: 20px; padding: 16px; background-color: #151e32; border-left: 4px solid #d4af37; border-radius: 6px;">
        <h4 style="margin: 0 0 8px 0; color: #d4af37; font-size: 13px; text-transform: uppercase;">Bio & Background:</h4>
        <p style="margin: 0; color: #f8fafc; font-size: 14px; white-space: pre-wrap; line-height: 1.6;">${data.bio}</p>
      </div>
    </div>
  `;

  return sendDirectEmail({
    to: TO_EMAIL,
    subject,
    replyTo: data.email,
    html,
    text,
  });
}

/**
 * 3. Event Registration Notification
 */
export async function sendEventRegistrationNotification(data: {
  eventTitle: string;
  fullName: string;
  email: string;
  phone: string;
}) {
  const subject = `[${ORG_NAME}] New Event RSVP: ${data.fullName} for ${data.eventTitle}`;
  const text = `
New Event Registration:

Event: ${data.eventTitle}
Attendee: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0c1322; color: #ffffff; border-radius: 12px; border: 1px solid #1e293b;">
      <div style="border-bottom: 1px solid #d4af37; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #d4af37; margin: 0; font-size: 20px;">New Event Registration</h2>
      </div>
      <p style="font-size: 15px; color: #e2e8f0; line-height: 1.6;"><strong>Event:</strong> <span style="color: #d4af37; font-weight: bold;">${data.eventTitle}</span></p>
      <p style="font-size: 15px; color: #e2e8f0; line-height: 1.6;"><strong>Attendee:</strong> ${data.fullName}</p>
      <p style="font-size: 15px; color: #e2e8f0; line-height: 1.6;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #60a5fa;">${data.email}</a></p>
      <p style="font-size: 15px; color: #e2e8f0; line-height: 1.6;"><strong>Phone:</strong> ${data.phone}</p>
    </div>
  `;

  return sendDirectEmail({
    to: TO_EMAIL,
    subject,
    replyTo: data.email,
    html,
    text,
  });
}

/**
 * 4. Newsletter Subscription Notification
 */
export async function sendNewsletterNotification(email: string) {
  const subject = `[${ORG_NAME}] New Newsletter Subscriber: ${email}`;
  const text = `A new user has subscribed to the Skill to Leadership newsletter:\n\nEmail: ${email}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0c1322; color: #ffffff; border-radius: 12px; border: 1px solid #1e293b;">
      <div style="border-bottom: 1px solid #d4af37; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #d4af37; margin: 0; font-size: 20px;">New Newsletter Subscriber</h2>
      </div>
      <p style="font-size: 15px; color: #e2e8f0; line-height: 1.6;">A new subscriber has joined your mailing list:</p>
      <p style="font-size: 16px; color: #60a5fa; font-weight: bold;"><a href="mailto:${email}" style="color: #60a5fa;">${email}</a></p>
    </div>
  `;

  return sendDirectEmail({
    to: TO_EMAIL,
    subject,
    replyTo: email,
    html,
    text,
  });
}
