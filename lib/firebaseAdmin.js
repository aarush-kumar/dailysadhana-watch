import admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        let privateKey = process.env.FIREBASE_PRIVATE_KEY;
        
        if (privateKey) {
            // SUPER-CLEANER: Strip any leading/trailing quotes, spaces, or literal \n strings
            privateKey = privateKey.trim();
            if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
                privateKey = privateKey.slice(1, -1);
            }
            if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
                privateKey = privateKey.slice(1, -1);
            }

            // Handle Base64 encoded private key
            if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
                try {
                    // Try to decode Base64 if it looks like it
                    const decoded = Buffer.from(privateKey, 'base64').toString('utf-8');
                    if (decoded.includes('-----BEGIN PRIVATE KEY-----')) {
                        privateKey = decoded;
                    }
                } catch (e) {
                    // Not Base64 or failed to decode, keep original
                }
            }

            // Ensure literal \n strings are converted to real newlines
            privateKey = privateKey.replace(/\\n/g, '\n');
            
            // Final check: if it still doesn't have the header/footer, it's definitely invalid
            if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
                console.error('FIREBASE_PRIVATE_KEY is missing the PEM header');
            }
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
            console.error('Missing Firebase Admin environment variables:', {
                projectId: !!serviceAccount.projectId,
                clientEmail: !!serviceAccount.clientEmail,
                privateKey: !!serviceAccount.privateKey
            });
        }
    } catch (error) {
        console.error('Firebase admin initialization error:', error.message);
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
