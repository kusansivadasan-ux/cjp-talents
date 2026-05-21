import type { WaitlistEntry } from '@/lib/types'
import { getResend, getFromAddress } from '@/lib/email/resend'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://cjptalents.in'

// ─── Welcome Email ────────────────────────────────────────────────────────────

function welcomeEmailTemplate(entry: WaitlistEntry): { subject: string; html: string; text: string } {
  const inviteLink = `${APP_URL}/join?ref=${entry.referral_code}&inv=1`

  const subject = "🪳 You're in! Welcome to CJP Talents"

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#0D0D0D;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D0D0D;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#141414;border-radius:12px;overflow:hidden;border:1px solid #2A2A2A;">
          <!-- Header -->
          <tr>
            <td style="background-color:#E8540A;padding:24px 32px;">
              <p style="margin:0;font-size:13px;font-weight:600;color:#0D0D0D;text-transform:uppercase;letter-spacing:0.1em;">CJP Talents</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <h1 style="margin:0 0 8px;font-size:28px;font-weight:700;color:#F5E8D5;line-height:1.2;">
                Welcome to the movement, ${entry.full_name.split(' ')[0]}
              </h1>
              <p style="margin:0 0 24px;font-size:13px;color:#E8540A;font-weight:500;">Member #${entry.display_number}</p>

              <p style="margin:0 0 16px;font-size:16px;color:#F5E8D5;line-height:1.6;">
                Your application has been reviewed and <strong style="color:#E8540A;">approved</strong>.
                You are member <strong>#${entry.display_number}</strong> of a movement being built by and for people who were told they didn't belong.
              </p>

              <p style="margin:0 0 24px;font-size:16px;color:#B0A090;line-height:1.6;">
                As a founding member, you've been gifted <strong style="color:#F5E8D5;">5 invite tokens</strong>.
                Use them to bring in people you believe in — your referrals get priority review.
              </p>

              <!-- Invite Link Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#1A1A1A;border:1px solid #2A2A2A;border-radius:8px;padding:20px 24px;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#B0A090;text-transform:uppercase;letter-spacing:0.08em;">Your Invite Link</p>
                    <a href="${inviteLink}" style="display:block;font-size:14px;color:#E8540A;word-break:break-all;text-decoration:none;">${inviteLink}</a>
                    <p style="margin:8px 0 0;font-size:12px;color:#6B6B6B;">Share this link. Each signup counts against your 5 tokens.</p>
                  </td>
                </tr>
              </table>

              <div style="margin:32px 0;border-top:1px solid #2A2A2A;"></div>

              <p style="margin:0;font-size:15px;font-style:italic;color:#6B6B6B;line-height:1.6;text-align:center;">
                "They called us cockroaches. We built a movement."
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#0D0D0D;padding:20px 32px;border-top:1px solid #1E1E1E;">
              <p style="margin:0;font-size:12px;color:#4A4A4A;text-align:center;">
                CJP Talents &mdash; Talent | Opportunity | Together<br/>
                <a href="${APP_URL}" style="color:#6B6B6B;text-decoration:none;">${APP_URL}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = `Welcome to the movement, ${entry.full_name.split(' ')[0]}!

Your application to CJP Talents has been approved.
You are member #${entry.display_number}.

As a founding member, you've been gifted 5 invite tokens.
Use them to bring in people you believe in — your referrals get priority review.

Your Invite Link:
${inviteLink}

---
"They called us cockroaches. We built a movement."

CJP Talents — Talent | Opportunity | Together
${APP_URL}
`

  return { subject, html, text }
}

// ─── Rejection Email ──────────────────────────────────────────────────────────

function rejectionEmailTemplate(entry: WaitlistEntry): { subject: string; html: string; text: string } {
  const subject = 'Update on your CJP Talents application'

  const notesSection = entry.review_notes
    ? `<p style="margin:16px 0 0;font-size:15px;color:#B0A090;line-height:1.6;"><strong style="color:#F5E8D5;">Reviewer note:</strong> ${entry.review_notes}</p>`
    : ''

  const notesText = entry.review_notes ? `\nReviewer note: ${entry.review_notes}\n` : ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#0D0D0D;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D0D0D;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#141414;border-radius:12px;overflow:hidden;border:1px solid #2A2A2A;">
          <!-- Header -->
          <tr>
            <td style="background-color:#1A1A1A;padding:24px 32px;border-bottom:1px solid #2A2A2A;">
              <p style="margin:0;font-size:13px;font-weight:600;color:#E8540A;text-transform:uppercase;letter-spacing:0.1em;">CJP Talents</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <h1 style="margin:0 0 24px;font-size:24px;font-weight:700;color:#F5E8D5;line-height:1.2;">
                Thank you for applying, ${entry.full_name.split(' ')[0]}
              </h1>

              <p style="margin:0 0 16px;font-size:16px;color:#B0A090;line-height:1.6;">
                We've carefully reviewed your application and unfortunately we're unable to approve it at this time.
              </p>

              <p style="margin:0 0 16px;font-size:16px;color:#B0A090;line-height:1.6;">
                CJP Talents is growing carefully to maintain the quality of connections. You're welcome to reapply in <strong style="color:#F5E8D5;">30 days</strong>.
              </p>

              ${notesSection}

              <div style="margin:32px 0;border-top:1px solid #2A2A2A;"></div>

              <p style="margin:0;font-size:14px;color:#6B6B6B;line-height:1.6;">
                The movement continues. We hope to see you back.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#0D0D0D;padding:20px 32px;border-top:1px solid #1E1E1E;">
              <p style="margin:0;font-size:12px;color:#4A4A4A;text-align:center;">
                CJP Talents &mdash; Talent | Opportunity | Together<br/>
                <a href="${APP_URL}" style="color:#6B6B6B;text-decoration:none;">${APP_URL}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = `Thank you for applying, ${entry.full_name.split(' ')[0]}.

We've carefully reviewed your application and unfortunately we're unable to approve it at this time.

CJP Talents is growing carefully to maintain the quality of connections. You're welcome to reapply in 30 days.
${notesText}
The movement continues. We hope to see you back.

---
CJP Talents — Talent | Opportunity | Together
${APP_URL}
`

  return { subject, html, text }
}

// ─── Send helpers ─────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(entry: WaitlistEntry): Promise<void> {
  const resend = getResend()
  const from = getFromAddress()
  const { subject, html, text } = welcomeEmailTemplate(entry)

  const { error } = await resend.emails.send({
    from,
    to: entry.email,
    subject,
    html,
    text,
  })

  if (error) {
    console.error('[sendWelcomeEmail] Resend error:', error)
    throw error
  }
}

export async function sendRejectionEmail(entry: WaitlistEntry): Promise<void> {
  const resend = getResend()
  const from = getFromAddress()
  const { subject, html, text } = rejectionEmailTemplate(entry)

  const { error } = await resend.emails.send({
    from,
    to: entry.email,
    subject,
    html,
    text,
  })

  if (error) {
    console.error('[sendRejectionEmail] Resend error:', error)
    throw error
  }
}
