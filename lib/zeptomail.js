export async function sendOtpEmail(toEmail, otp) {
    const res = await fetch('https://api.zeptomail.in/v1.1/email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.ZEPTOMAIL_API_KEY,
        },
        body: JSON.stringify({
            from: { address: 'login@thedailysadhana.com', name: 'Daily Sādhanā' },
            to: [{ email_address: { address: toEmail } }],
            subject: 'Your Daily Sādhanā login code',
            htmlbody: `<div style="font-family:sans-serif;max-width:420px;margin:0 auto;padding:32px;background:#faf9f7;border-radius:12px">
  <p style="font-size:16px;color:#544342;margin-bottom:8px">Your login code is:</p>
  <p style="font-size:36px;font-weight:700;letter-spacing:0.25em;color:#8B0000;margin:16px 0">${otp}</p>
  <p style="font-size:13px;color:#888;margin-top:24px">This code expires in 10 minutes. Do not share it with anyone.</p>
</div>`,
        }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`ZeptoMail error ${res.status}: ${text}`);
    }

    return res.json();
}
