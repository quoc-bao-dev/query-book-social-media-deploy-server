import { Document, model, Schema } from 'mongoose';

export type AccountSchema = Document & {
    userId: string; // ref to user,
    limitDeploy: number;
    accountType: 'pro' | 'standard';
    coins: number;
    createdAt: Date;
    updatedAt: Date;
};

const AccountSchema = new Schema<AccountSchema>({
    userId: { type: String, required: true },
    limitDeploy: { type: Number, required: true },
    accountType: { type: String, required: true },
    coins: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
});

export default model('Account', AccountSchema);
