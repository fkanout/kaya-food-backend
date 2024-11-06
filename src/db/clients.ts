import { DB_COLLECTIONS } from "./constants";
import { db } from "./index"


export async function saveVerifiedClient({ phoneNumber }: { phoneNumber: string }) {
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
interface UpdateClientProfile {
    firstName: string;
    lastName: string;
    preferences: string[]; //TODO: define categories
    address: {
        residence: string;
        block: string;
        flat: string;
    },
    birthday: string;
}

export async function updateClientProfile(userProfile: UpdateClientProfile, phoneNumber: string) {
    const usersRef = db.collection(DB_COLLECTIONS.USERS);
    const querySnapshot = await usersRef.where('phoneNumber', '==', phoneNumber).limit(1).get();
    if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        const updateData = {
            ...querySnapshot.docs[0].data(),
            ...userProfile
        }
        await docRef.set(updateData);
        const updateProfileRef = await docRef.get();
        return updateProfileRef.data();
    } else {
        throw ("Error user doesn't exists")
    }
}

export async function getClientByPhoneNumber(phoneNumber: string) {
    const usersRef = db.collection(DB_COLLECTIONS.USERS);
    const querySnapshot = await usersRef.where('phoneNumber', '==', phoneNumber).limit(1).get();
    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
    } else {
        throw ("Error user doesn't exists")
    }
}