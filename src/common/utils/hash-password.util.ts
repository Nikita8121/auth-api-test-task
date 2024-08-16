import * as bcrypt from 'bcryptjs';

export async function compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

export async function hash(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
}
