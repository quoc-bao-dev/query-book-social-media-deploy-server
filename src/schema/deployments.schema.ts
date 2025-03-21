import { model, Schema } from 'mongoose';

type DeploymentSchema = {
    userId: string;
    subdomain: string;
    createdAt: Date;
    updatedAt: Date;
};

const DeploymentsSchema = new Schema<DeploymentSchema>({
    userId: { type: String, required: true },
    subdomain: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
});

export default model('Deployments', DeploymentsSchema);
