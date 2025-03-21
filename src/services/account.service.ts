import axios from 'axios';
import { config } from '../config';
import accountSchema, { AccountSchema } from '../schema/account.schema';

class AccountService {
    async getByUserId(userId: string) {
        const user = await accountSchema.findOne({ userId });

        if (!user) {
            const userResponse = await axios.get(
                `${config.BASE_URL}/api/v1/users/profile/${userId}`
            );

            if (userResponse.status === 200) {
                const { data } = userResponse;
                const account = new accountSchema({
                    userId,
                    limitDeploy: data.accountType === 'pro' ? 10 : 3,
                    accountType: data.accountType || 'standard',
                    coins: data.coins || 0,
                });
                await account.save();
                return account as AccountSchema;
            }
        }

        return user as AccountSchema;
    }
}

export default new AccountService();
