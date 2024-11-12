import * as murmurhash from 'murmurhash'; // Make sure murmurhash is installed

export function hashString(...args: string[]): string {
    const combined = args.join('');
    const hash = murmurhash.v3(combined);
    return hash.toString(36); //e.g k9a3d
}