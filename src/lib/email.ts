import { Resend } from 'resend'

// Default to a dummy key during build or local dev if not provided
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_12345')

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder') {
    console.warn('RESEND_API_KEY is not set. Simulating email send to:', email)
    console.warn('Reset URL:', resetUrl)
    return { success: true }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Admin <admin@resend.dev>', // Update with verified domain later
      to: [email],
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Password Reset</h2>
          <p>You recently requested to reset your password for your admin account.</p>
          <p>Click the button below to reset it. This link will expire in 30 minutes.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #00D084; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #666; font-size: 14px;">If you did not request a password reset, please ignore this email or reply to let us know.</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin-top: 30px;" />
          <p style="color: #999; font-size: 12px;">This is an automated message. Please do not reply.</p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email exception:', error)
    return { success: false, error }
  }
}
