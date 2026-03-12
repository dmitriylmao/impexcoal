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
    <div style="margin:0;padding:28px;background:#04070d;font-family:Arial,sans-serif;color:#d5dbe6;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:740px;margin:0 auto;border-collapse:collapse;background:#04070d;border:1px solid rgba(216,231,242,0.12);border-radius:18px;overflow:hidden;box-shadow:inset 0 2px 1px rgba(207,231,255,0.2),0 24px 64px rgba(0,0,0,0.45);">
        <tr>
          <td style="padding:26px 30px;background:radial-gradient(55% 90% at 50% 120%,rgba(242,82,0,0.22) 0%,rgba(4,7,13,0) 100%),#04070d;border-bottom:1px solid rgba(216,231,242,0.12);">
            <div style="font-size:30px;font-weight:800;line-height:1;color:#ffffff;letter-spacing:0.7px;">IMPEX COAL</div>
            <div style="margin-top:10px;font-size:15px;line-height:1.4;color:rgba(213,219,230,0.76);">Новая заявка с формы обратной связи</div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 30px 30px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:#04070d;border:1px solid rgba(216,231,242,0.1);border-radius:14px;overflow:hidden;">
              <tr>
                <td style="padding:15px 18px;width:180px;font-size:14px;font-weight:700;color:rgba(213,219,230,0.72);border-bottom:1px solid rgba(216,231,242,0.1);">ФИО</td>
                <td style="padding:15px 18px;font-size:18px;font-weight:700;color:#ffffff;border-bottom:1px solid rgba(216,231,242,0.1);">${fullName}</td>
              </tr>
              <tr>
                <td style="padding:15px 18px;width:180px;font-size:14px;font-weight:700;color:rgba(213,219,230,0.72);border-bottom:1px solid rgba(216,231,242,0.1);">Email</td>
                <td style="padding:15px 18px;font-size:17px;font-weight:600;color:#ffffff;border-bottom:1px solid rgba(216,231,242,0.1);">${email}</td>
              </tr>
              <tr>
                <td style="padding:15px 18px;width:180px;font-size:14px;font-weight:700;color:rgba(213,219,230,0.72);vertical-align:top;">Комментарий</td>
                <td style="padding:15px 18px;font-size:17px;line-height:1.6;color:rgb(213,219,230);">${comment}</td>
              </tr>
            </table>
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
