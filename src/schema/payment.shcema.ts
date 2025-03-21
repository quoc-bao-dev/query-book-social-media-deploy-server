type PaymentSchema = {
    userId: string;
    amount: number;
    currency: string;
    paymentMethodId: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
};
