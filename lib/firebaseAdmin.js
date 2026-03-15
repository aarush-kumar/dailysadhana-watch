import admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        let privateKey = process.env.FIREBASE_PRIVATE_KEY;
        
        // Handle Base64 encoded private key (more reliable on Vercel)
        if (privateKey && !privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
            try {
                privateKey = Buffer.from(privateKey, 'base64').toString('utf-8');
            } catch (e) {
                console.error('Failed to decode Base64 FIREBASE_PRIVATE_KEY');
            }
        }

        // Ensure the private key has proper line breaks if not already present
        if (privateKey) {
            privateKey = privateKey.replace(/\\n/g, '\n');
        }

        const serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        };

        if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        } else {
            console.error('Missing Firebase Admin environment variables');
        }
    } catch (error) {
        console.error('Firebase admin initialization error', error);
    }
}

let db;
let auth;

try {
    if (admin.apps.length) {
        db = admin.firestore();
        auth = admin.auth();
    }
} catch (e) {
    console.error("Firebase services not initialized (likely missing credentials)");
}

export { admin, db, auth };
