import admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (error) {
        console.error('Firebase admin initialization error', error);
    }
}

let db;
let auth;

try {
    db = admin.firestore();
    auth = admin.auth();
} catch (e) {
    console.error("Firebase services not initialized (likely missing credentials)");
}

export { admin, db, auth };
