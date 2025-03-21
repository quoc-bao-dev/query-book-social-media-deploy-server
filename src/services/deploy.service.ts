import deploymentsSchema from '../schema/deployments.schema';
import { getUrl } from '../utils';

class DeployService {
    async getDeployByUserId(userId: string) {
        const deploys = await deploymentsSchema.find({
            userId,
        });

        const deployments = deploys.map((deploy) => {
            return {
                userId: deploy.userId,
                subdomain: deploy.subdomain,
                url: getUrl(deploy.subdomain),
            };
        });

        return deployments;
    }

    async getDeployBySubDomain(subDomain: string) {
        const deploys = await deploymentsSchema.findOne({
            subdomain: subDomain,
        });

        return deploys;
    }

    async createDeploy(payload: any) {
        const deploy = new deploymentsSchema(payload);
        const result = await deploy.save();
        return result;
    }

    async delete(payload: any) {
        const subDomain = payload.subDomain;

        await deploymentsSchema.deleteOne({ subdomain: subDomain });
        return true;
    }
}

export default new DeployService();
