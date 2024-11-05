import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 120 }); // TTL of 120 seconds (2 minutes)

// Function to generate a random 6-digit verification code
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to save phone number and verification code in cache
export function storePhoneNumberWithOTP(phoneNumber: string, otp: string): boolean {
    cache.set(phoneNumber, otp);
    console.info(`Verification code for ${phoneNumber}: ${otp}`);
    if (otp) {
        return true
    } else {
        return false
    }
}

// Function to validate the verification code
export function validateOTP(phoneNumber: string, code: string): boolean {
    const cachedCode = cache.get<string>(phoneNumber);

    if (cachedCode === code) {
        console.log('Verification successful');
        cache.del(phoneNumber); // Remove the code after successful verification
        return true;
    } else {
        console.log('Verification failed');
        return false;
    }
}
