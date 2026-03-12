'use server';

export type FeedbackActionState = {
  status: 'idle' | 'success' | 'error';
  errorCode?: 'missing_fields' | 'not_configured' | 'send_failed' | 'network';
};

const IS_TEST_MODE = true;
const MAIN_RECIPIENT = 'tdimpeks@support.com';
const TEST_RECIPIENT = 'dimaeleckij2016@gmail.com';
const MAIL_FROM = 'onboarding@resend.dev';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildFeedbackEmailHtml(params: { fullName: string; email: string; comment: string }) {
  const fullName = escapeHtml(params.fullName);
  const email = escapeHtml(params.email);
  const comment = escapeHtml(params.comment).replaceAll('\n', '<br />');

  return `
    <div style="margin:0;padding:24px;background:#04070d;font-family:Arial,sans-serif;color:#d5dbe6;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:680px;margin:0 auto;border-collapse:collapse;background:#0b111b;border:1px solid rgba(216,231,242,0.12);border-radius:14px;overflow:hidden;">
        <tr>
          <td style="padding:20px 24px;background:linear-gradient(180deg,#121a28 0%,#0b111b 100%);border-bottom:1px solid rgba(216,231,242,0.12);">
            <div style="font-size:18px;font-weight:700;letter-spacing:0.5px;color:#ffffff;">IMPEX COAL</div>
            <div style="margin-top:6px;font-size:13px;line-height:1.45;color:#aab4c5;">New feedback form submission</div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 24px 24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:#0e1624;border:1px solid rgba(216,231,242,0.14);border-radius:10px;overflow:hidden;">
              <tr>
                <td style="padding:12px 14px;width:140px;font-size:13px;font-weight:600;color:#8f9cb2;border-bottom:1px solid rgba(216,231,242,0.1);">Full name</td>
                <td style="padding:12px 14px;font-size:14px;color:#ffffff;border-bottom:1px solid rgba(216,231,242,0.1);">${fullName}</td>
              </tr>
              <tr>
                <td style="padding:12px 14px;width:140px;font-size:13px;font-weight:600;color:#8f9cb2;border-bottom:1px solid rgba(216,231,242,0.1);">Email</td>
                <td style="padding:12px 14px;font-size:14px;color:#ffffff;border-bottom:1px solid rgba(216,231,242,0.1);">${email}</td>
              </tr>
              <tr>
                <td style="padding:12px 14px;width:140px;font-size:13px;font-weight:600;color:#8f9cb2;vertical-align:top;">Comment</td>
                <td style="padding:12px 14px;font-size:14px;line-height:1.55;color:#d5dbe6;">${comment}</td>
              </tr>
            </table>

            <div style="margin-top:16px;font-size:12px;line-height:1.5;color:#8694ac;">
              Accent color: <span style="display:inline-block;padding:2px 8px;border-radius:999px;background:#f25200;color:#ffffff;font-weight:700;">#F25200</span>
            </div>
          </td>
        </tr>
      </table>
    </div>
  `.trim();
}

export async function sendFeedbackAction(
  _prevState: FeedbackActionState,
  formData: FormData,
): Promise<FeedbackActionState> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return {
      status: 'error',
      errorCode: 'not_configured',
    };
  }

  const fullName = String(formData.get('fullName') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const comment = String(formData.get('comment') ?? '').trim();

  if (!fullName || !email || !comment) {
    return {
      status: 'error',
      errorCode: 'missing_fields',
    };
  }

  const recipient = IS_TEST_MODE ? TEST_RECIPIENT : MAIN_RECIPIENT;
  const subject = `Feedback: ${fullName}`;
  const html = buildFeedbackEmailHtml({ fullName, email, comment });
  const text = `Full name: ${fullName}\nEmail: ${email}\n\nComment:\n${comment}`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: recipient,
        reply_to: email,
        subject,
        html,
        text,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        status: 'error',
        errorCode: 'send_failed',
      };
    }

    return {
      status: 'success',
    };
  } catch {
    return {
      status: 'error',
      errorCode: 'network',
    };
  }
}
