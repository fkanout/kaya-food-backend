import { DB_COLLECTIONS } from "./constants";
import { db } from "./index"
interface SmsAuth {
    phoneNumber: string;
}

export async function saveOrReturnVerifiedUser({ phoneNumber }: SmsAuth) {
    const usersRef = db.collection(DB_COLLECTIONS.USERS);

    const querySnapshot = await usersRef.where('phoneNumber', '==', phoneNumber).limit(1).get();

    if (!querySnapshot.empty) {
        // User exists, return the first matching document reference
        return querySnapshot.docs[0].data();
    } else {
        // User does not exist, create a new one
        const newUserRef = usersRef.doc();
        await newUserRef.set({ phoneNumber, createdDate: new Date().getTime() });
        const newUserSnapshot = await newUserRef.get();
        return newUserSnapshot.data();
    }
}
