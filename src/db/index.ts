import * as admin from 'firebase-admin';
if (!process.env.FIREBASE_CONFIG) {
    throw new Error("FIREBASE_CONFIG environment variable is not set.");
}
const decodedKey = Buffer.from(process.env.FIREBASE_CONFIG as string, 'base64').toString('utf8');
const serviceAccount = JSON.parse(decodedKey);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
export { db };