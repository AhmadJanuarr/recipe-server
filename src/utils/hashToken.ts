import crypto from 'crypto';

export const HashToken = (token : string) =>{
    return crypto.createHash('sha256').update(token).digest('hex');
}