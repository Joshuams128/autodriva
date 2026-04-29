import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, service, msg, type } = body;

    if (!name || !email) {
      return Response.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const htmlContent = type === 'mini'
      ? `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>New Request Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Best Time to Call:</strong> ${body.time || 'Not specified'}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${msg}</p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>New Message from AutoDriva Website</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Service Interest:</strong> ${service || 'Not specified'}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${msg}</p>
        </div>
      `;

    const result = await resend.emails.send({
      from: 'info@autodriva.com',
      to: 'Joshuams128@gmail.com',
      subject: `New ${type === 'mini' ? 'Request' : 'Message'} from AutoDriva Website - ${name}`,
      html: htmlContent,
    });

    if (result.error) {
      return Response.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return Response.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error('Contact form error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
