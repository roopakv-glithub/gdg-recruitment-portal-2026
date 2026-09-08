import { NextResponse } from 'next/server';
import { connect, serializeFirestoreData } from '@/lib/db';
import { requireAdmin } from '@/lib/server-auth';
import { demoMode } from '@/lib/demo';
import { deliverQueuedEmail } from '@/lib/email-delivery';

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function shortlistEmail(applicant) {
    const portalUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || 'https://gdg-recruitment-portal-2026.vercel.app').replace(/\/$/, '');
    const name = String(applicant.Name || 'Applicant').trim();
    const department = String(applicant.Department || 'your selected department').trim();
    const safeName = escapeHtml(name);
    const safeDepartment = escapeHtml(department);
    const applicationUrl = `${portalUrl}/applications`;
    return {
        subject: `${department} Recruitment 2026 — Selection Update`,
        messageText: `Hi ${name},\n\nCongratulations! You have been selected for ${department} in Recruitment Portal 2026.\n\nYou can review your submitted application at ${applicationUrl}.\n\nThe recruitment team will contact you with the next steps.\n\nGDG on Campus Recruitment Team`,
        messageHtml: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="color-scheme" content="dark">
    <meta name="supported-color-schemes" content="dark">
    <title>${safeDepartment} Recruitment 2026</title>
  </head>
  <body style="margin:0;padding:0;background:#202124;color:#f8f9fa;font-family:Arial,'Helvetica Neue',sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Congratulations — you have been selected for ${safeDepartment}.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#202124;">
      <tr>
        <td align="center" style="padding:32px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:620px;background:#101114;border:1px solid #34373d;border-radius:18px;overflow:hidden;box-shadow:0 18px 48px rgba(0,0,0,.3);">
            <tr>
              <td style="height:7px;background:#4285f4;width:25%;font-size:0;line-height:0;">&nbsp;</td>
              <td style="height:7px;background:#ea4335;width:25%;font-size:0;line-height:0;">&nbsp;</td>
              <td style="height:7px;background:#fbbc04;width:25%;font-size:0;line-height:0;">&nbsp;</td>
              <td style="height:7px;background:#34a853;width:25%;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td colspan="4" style="padding:48px 52px 42px;">
                <p style="margin:0 0 22px;color:#4285f4;font-size:15px;font-weight:700;letter-spacing:1.2px;line-height:1.5;text-transform:uppercase;">Google Developer Groups on Campus</p>
                <h1 style="margin:0 0 34px;color:#f8f9fa;font-size:44px;font-weight:600;letter-spacing:-1.3px;line-height:1.12;">${safeDepartment}<br>Recruitment 2026:<br>Selection</h1>
                <p style="margin:0 0 24px;color:#d7dce5;font-size:24px;line-height:1.45;">Hi ${safeName},</p>
                <p style="margin:0 0 24px;color:#c7ccd5;font-size:18px;line-height:1.75;">Congratulations! We are excited to inform you that you have been selected for the <strong style="color:#ffffff;">${safeDepartment}</strong> department.</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:30px 0;background:#181a1f;border:1px solid #30343b;border-radius:12px;">
                  <tr>
                    <td style="padding:20px 22px;border-left:4px solid #34a853;">
                      <p style="margin:0 0 5px;color:#9aa0a6;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Selected department</p>
                      <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;line-height:1.4;">${safeDepartment}</p>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 30px;color:#c7ccd5;font-size:16px;line-height:1.7;">The recruitment team will contact you with the next steps. Your submitted answers remain available in the portal for reference.</p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td bgcolor="#4285f4" style="border-radius:9px;">
                      <a href="${applicationUrl}" style="display:inline-block;padding:14px 24px;color:#ffffff;font-size:16px;font-weight:700;line-height:1;text-decoration:none;">View your application&nbsp;&nbsp;→</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td colspan="4" style="padding:22px 52px;background:#0b0c0e;border-top:1px solid #292c31;">
                <p style="margin:0;color:#858b94;font-size:13px;line-height:1.6;">GDG on Campus · Recruitment Portal 2026<br>This message was sent because your application status was updated.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
    };
}

export async function PATCH(req, { params }) {
    const { id } = await params;
    try {
        const session = await requireAdmin();
        if (!session) {
            return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
        }

        const db = await connect();
        const { shortlisted } = await req.json();
        if (typeof shortlisted !== 'boolean') {
            return NextResponse.json({ success: false, message: 'shortlisted must be a boolean' }, { status: 400 });
        }

        const docRef = db.collection('formData').doc(id);
        const selectedRef = db.collection('selectedApplicants').doc(id);
        let emailJobId = null;

        if (demoMode) {
            const snapshot = await docRef.get();
            if (!snapshot.exists) {
                return NextResponse.json({ success: false, message: 'Applicant not found' }, { status: 404 });
            }
            await docRef.update({ shortlisted });
        } else {
            await db.runTransaction(async (transaction) => {
                const snapshot = await transaction.get(docRef);
                if (!snapshot.exists) {
                    const error = new Error('Applicant not found');
                    error.code = 'NOT_FOUND';
                    throw error;
                }

                const applicant = snapshot.data();
                const wasShortlisted = Boolean(applicant.shortlisted);
                const currentSequence = Number(applicant.shortlistEmailSequence || 0);
                const nextSequence = shortlisted && !wasShortlisted
                    ? currentSequence + 1
                    : currentSequence;
                transaction.update(docRef, {
                    shortlisted,
                    shortlistedAt: shortlisted ? new Date() : null,
                    shortlistedBy: session.user.email,
                    shortlistEmailSequence: nextSequence,
                });

                if (shortlisted) {
                    transaction.set(selectedRef, {
                        applicationId: id,
                        Name: applicant.Name,
                        Email: applicant.Email,
                        Department: applicant.Department,
                        RegistrationNumber: applicant.RegistrationNumber,
                        selectedAt: new Date(),
                        selectedBy: session.user.email,
                    });
                    if (!wasShortlisted) {
                        emailJobId = `${id}-shortlisted-${nextSequence}`;
                        const queueRef = db.collection('emailQueue').doc(emailJobId);
                        transaction.set(queueRef, {
                            ...shortlistEmail(applicant),
                            type: 'shortlisted',
                            deliveryChannel: 'nodemailer-smtp',
                            idempotencyKey: emailJobId,
                            shortlistSequence: nextSequence,
                            applicationId: id,
                            recipientEmail: applicant.Email,
                            recipientName: applicant.Name,
                            department: applicant.Department,
                            status: 'pending',
                            attempts: 0,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                    }
                } else {
                    transaction.delete(selectedRef);
                }
            });
        }
        const updatedSnapshot = await docRef.get();

        const applicant = {
            id: updatedSnapshot.id,
            _id: updatedSnapshot.id,
            ...serializeFirestoreData(updatedSnapshot.data()),
        };

        const emailDelivery = !demoMode && emailJobId
            ? await deliverQueuedEmail(db, emailJobId)
            : { status: shortlisted ? (demoMode ? 'demo' : 'unchanged') : 'cancelled' };

        return NextResponse.json({ success: true, data: applicant, emailDelivery });
    } catch (error) {
        console.error('Error updating applicant:', error.message);
        const status = error?.code === 'NOT_FOUND' ? 404 : 400;
        return NextResponse.json({ success: false, message: error.message }, { status });
    }
}
