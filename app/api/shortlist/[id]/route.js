import { NextResponse } from 'next/server';
import { connect, serializeFirestoreData } from '@/lib/db';
import { requireAdmin } from '@/lib/server-auth';
import { demoMode } from '@/lib/demo';

function shortlistEmail(applicant) {
    const portalUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || 'https://gdg-recruitment-portal-2026.vercel.app').replace(/\/$/, '');
    const name = String(applicant.Name || 'Applicant').trim();
    const department = String(applicant.Department || 'your selected department').trim();
    return {
        subject: `You have been selected for ${department}`,
        messageText: `Hi ${name},\n\nCongratulations! You have been selected for ${department} in Recruitment Portal 2026.\n\nYou can review your submitted application at ${portalUrl}/applications.\n\nThe recruitment team will contact you with the next steps.`,
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
        const queueRef = db.collection('emailQueue').doc(`${id}-shortlisted`);

        if (demoMode) {
            const snapshot = await docRef.get();
            if (!snapshot.exists) {
                return NextResponse.json({ success: false, message: 'Applicant not found' }, { status: 404 });
            }
            await docRef.update({ shortlisted });
        } else {
            await db.runTransaction(async (transaction) => {
                const [snapshot, queueSnapshot] = await Promise.all([
                    transaction.get(docRef),
                    transaction.get(queueRef),
                ]);
                if (!snapshot.exists) {
                    const error = new Error('Applicant not found');
                    error.code = 'NOT_FOUND';
                    throw error;
                }

                const applicant = snapshot.data();
                const wasShortlisted = Boolean(applicant.shortlisted);
                transaction.update(docRef, {
                    shortlisted,
                    shortlistedAt: shortlisted ? new Date() : null,
                    shortlistedBy: session.user.email,
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
                    const queueStatus = queueSnapshot.data()?.status;
                    if (!queueSnapshot.exists || (!wasShortlisted && (queueStatus === 'cancelled' || queueStatus === 'failed'))) {
                        transaction.set(queueRef, {
                            ...shortlistEmail(applicant),
                            type: 'shortlisted',
                            deliveryChannel: 'activepieces-gmail',
                            idempotencyKey: `${id}-shortlisted`,
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
                    if (queueSnapshot.exists && queueSnapshot.data()?.status !== 'sent') {
                        transaction.set(queueRef, {
                            status: 'cancelled',
                            cancelledAt: new Date(),
                            updatedAt: new Date(),
                        }, { merge: true });
                    }
                }
            });
        }
        const updatedSnapshot = await docRef.get();

        const applicant = {
            id: updatedSnapshot.id,
            _id: updatedSnapshot.id,
            ...serializeFirestoreData(updatedSnapshot.data()),
        };

        const emailDelivery = { status: shortlisted ? (demoMode ? 'demo' : 'queued') : 'cancelled' };

        return NextResponse.json({ success: true, data: applicant, emailDelivery });
    } catch (error) {
        console.error('Error updating applicant:', error.message);
        const status = error?.code === 'NOT_FOUND' ? 404 : 400;
        return NextResponse.json({ success: false, message: error.message }, { status });
    }
}
