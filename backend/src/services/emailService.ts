import nodemailer, { Transporter } from 'nodemailer';
import config from '../config';
import logger, { logEmail } from '../utils/logger';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  private transporter: Transporter | null = null;
  private isConfigured: boolean;

  constructor() {
    this.isConfigured = this.initializeTransporter();
  }

  private initializeTransporter(): boolean {
    try {
      if (!config.email.smtp.user || !config.email.smtp.password) {
        logger.warn('Email service not configured - missing SMTP credentials');
        return false;
      }

      this.transporter = nodemailer.createTransport({
        host: config.email.smtp.host,
        port: config.email.smtp.port,
        secure: config.email.smtp.secure,
        auth: {
          user: config.email.smtp.user,
          pass: config.email.smtp.password,
        },
        tls: {
          rejectUnauthorized: config.NODE_ENV === 'production',
        },
      });

      logger.info('Email service initialized successfully');
      return true;
    } catch (error) {
      logger.error('Failed to initialize email service:', error);
      return false;
    }
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
    text?: string
  ): Promise<void> {
    if (!this.isConfigured) {
      logger.warn('Email service not configured, skipping email send', { to, subject });
      return;
    }

    try {
      const mailOptions = {
        from: {
          name: 'Jobifies',
          address: config.email.smtp.user,
        },
        to,
        subject,
        html,
        text: text || this.htmlToText(html),
      };

      const result = await this.transporter?.sendMail(mailOptions);
      
      logEmail('Email sent', to, subject, 'sent');
      logger.info('Email sent successfully', {
        to,
        subject,
        messageId: result.messageId,
      });
    } catch (error) {
      logEmail('Email failed', to, subject, 'failed', error);
      throw error;
    }
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }

  private getEmailTemplate(templateName: string, variables: Record<string, string>): EmailTemplate {
    const templates: Record<string, EmailTemplate> = {
      verification: {
        subject: 'Verify Your Email Address - Jobifies',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #6366f1; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9fafb; }
              .button { 
                display: inline-block; 
                padding: 12px 24px; 
                background: #6366f1; 
                color: white; 
                text-decoration: none; 
                border-radius: 6px; 
                margin: 20px 0;
              }
              .footer { padding: 20px; text-align: center; font-size: 14px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to Jobifies!</h1>
              </div>
              <div class="content">
                <h2>Hi ${variables.firstName},</h2>
                <p>Thank you for signing up for Jobifies! To complete your registration, please verify your email address by clicking the button below:</p>
                <div style="text-align: center;">
                  <a href="${config.urls.frontend}/verify-email?token=${variables.token}" class="button">Verify Email Address</a>
                </div>
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #6366f1;">${config.urls.frontend}/verify-email?token=${variables.token}</p>
                <p>This verification link will expire in 24 hours.</p>
                <p>If you didn't create an account with Jobifies, please ignore this email.</p>
              </div>
              <div class="footer">
                <p>&copy; 2025 Jobifies. All rights reserved.</p>
                <p>This is an automated email, please do not reply.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `Hi ${variables.firstName},

Thank you for signing up for Jobifies! To complete your registration, please verify your email address by visiting:

${config.urls.frontend}/verify-email?token=${variables.token}

This verification link will expire in 24 hours.

If you didn't create an account with Jobifies, please ignore this email.

© 2025 Jobifies. All rights reserved.`,
      },

      welcome: {
        subject: 'Welcome to Jobifies - Your Journey Starts Here!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Jobifies</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #6366f1; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9fafb; }
              .feature { margin: 20px 0; padding: 15px; background: white; border-radius: 6px; }
              .button { 
                display: inline-block; 
                padding: 12px 24px; 
                background: #6366f1; 
                color: white; 
                text-decoration: none; 
                border-radius: 6px; 
                margin: 10px 5px;
              }
              .footer { padding: 20px; text-align: center; font-size: 14px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Welcome to Jobifies!</h1>
              </div>
              <div class="content">
                <h2>Hi ${variables.firstName},</h2>
                <p>Congratulations! Your email has been verified and your Jobifies account is now active.</p>
                
                <h3>What can you do next?</h3>
                
                <div class="feature">
                  <h4>📝 Complete Your Profile</h4>
                  <p>Add your experience, skills, and preferences to help employers find you.</p>
                </div>
                
                <div class="feature">
                  <h4>🔍 Explore Job Opportunities</h4>
                  <p>Browse thousands of job listings from top companies.</p>
                </div>
                
                <div class="feature">
                  <h4>🚀 Set Up Job Alerts</h4>
                  <p>Get notified when jobs matching your criteria are posted.</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${config.urls.frontend}/dashboard" class="button">Go to Dashboard</a>
                  <a href="${config.urls.frontend}/jobs" class="button">Browse Jobs</a>
                </div>
                
                <p>If you have any questions, our support team is here to help at support@jobifies.com</p>
                
                <p>Happy job hunting!</p>
                <p>The Jobifies Team</p>
              </div>
              <div class="footer">
                <p>&copy; 2025 Jobifies. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `Hi ${variables.firstName},

Congratulations! Your email has been verified and your Jobifies account is now active.

What can you do next?

📝 Complete Your Profile
Add your experience, skills, and preferences to help employers find you.

🔍 Explore Job Opportunities  
Browse thousands of job listings from top companies.

🚀 Set Up Job Alerts
Get notified when jobs matching your criteria are posted.

Visit your dashboard: ${config.urls.frontend}/dashboard
Browse jobs: ${config.urls.frontend}/jobs

If you have any questions, our support team is here to help at support@jobifies.com

Happy job hunting!
The Jobifies Team

© 2025 Jobifies. All rights reserved.`,
      },

      passwordReset: {
        subject: 'Reset Your Password - Jobifies',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9fafb; }
              .button { 
                display: inline-block; 
                padding: 12px 24px; 
                background: #dc2626; 
                color: white; 
                text-decoration: none; 
                border-radius: 6px; 
                margin: 20px 0;
              }
              .warning { 
                background: #fef2f2; 
                border: 1px solid #fecaca; 
                padding: 15px; 
                border-radius: 6px; 
                margin: 20px 0;
              }
              .footer { padding: 20px; text-align: center; font-size: 14px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Password Reset Request</h1>
              </div>
              <div class="content">
                <h2>Hi ${variables.firstName},</h2>
                <p>We received a request to reset your password for your Jobifies account.</p>
                
                <div style="text-align: center;">
                  <a href="${config.urls.frontend}/reset-password?token=${variables.token}" class="button">Reset Password</a>
                </div>
                
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #dc2626;">${config.urls.frontend}/reset-password?token=${variables.token}</p>
                
                <div class="warning">
                  <strong>⚠️ Security Notice:</strong>
                  <ul>
                    <li>This reset link will expire in 1 hour</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                    <li>Your password will remain unchanged unless you click the link above</li>
                  </ul>
                </div>
                
                <p>If you're having trouble accessing your account or didn't request this reset, please contact our support team at support@jobifies.com</p>
              </div>
              <div class="footer">
                <p>&copy; 2025 Jobifies. All rights reserved.</p>
                <p>This is an automated email, please do not reply.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `Hi ${variables.firstName},

We received a request to reset your password for your Jobifies account.

Reset your password by visiting: ${config.urls.frontend}/reset-password?token=${variables.token}

⚠️ Security Notice:
- This reset link will expire in 1 hour
- If you didn't request this reset, please ignore this email  
- Your password will remain unchanged unless you click the link above

If you're having trouble, contact support at support@jobifies.com

© 2025 Jobifies. All rights reserved.`,
      },
    };

    return templates[templateName];
  }

  async sendVerificationEmail(
    to: string,
    firstName: string,
    token: string
  ): Promise<void> {
    const template = this.getEmailTemplate('verification', { firstName, token });
    await this.sendEmail(to, template.subject, template.html, template.text);
  }

  async sendWelcomeEmail(to: string, firstName: string): Promise<void> {
    const template = this.getEmailTemplate('welcome', { firstName });
    await this.sendEmail(to, template.subject, template.html, template.text);
  }

  async sendPasswordResetEmail(
    to: string,
    firstName: string,
    token: string
  ): Promise<void> {
    const template = this.getEmailTemplate('passwordReset', { firstName, token });
    await this.sendEmail(to, template.subject, template.html, template.text);
  }

  async sendJobApplicationNotification(
    to: string,
    recruiterName: string,
    jobTitle: string,
    applicantName: string
  ): Promise<void> {
    const subject = `New Application Received - ${jobTitle}`;
    const html = `
      <h2>New Job Application</h2>
      <p>Hi ${recruiterName},</p>
      <p>You have received a new application for the position: <strong>${jobTitle}</strong></p>
      <p>Applicant: ${applicantName}</p>
      <p>Please log in to your Jobifies dashboard to review the application.</p>
      <a href="${config.urls.frontend}/recruiter/applications">View Applications</a>
    `;
    await this.sendEmail(to, subject, html);
  }

  async sendApplicationStatusUpdate(
    to: string,
    applicantName: string,
    jobTitle: string,
    companyName: string,
    status: string
  ): Promise<void> {
    const subject = `Application Update - ${jobTitle}`;
    const html = `
      <h2>Application Status Update</h2>
      <p>Hi ${applicantName},</p>
      <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been updated.</p>
      <p>Status: <strong>${status}</strong></p>
      <p>Log in to your dashboard for more details.</p>
      <a href="${config.urls.frontend}/applications">View Applications</a>
    `;
    await this.sendEmail(to, subject, html);
  }

  async testConnection(): Promise<boolean> {
    if (!this.isConfigured) {
      return false;
    }

    try {
      await this.transporter?.verify();
      logger.info('Email service connection test successful');
      return true;
    } catch (error) {
      logger.error('Email service connection test failed:', error);
      return false;
    }
  }
}

export default new EmailService();