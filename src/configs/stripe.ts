const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SK);


export const generatePymentMethod = async (token:string) => {
    const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: { token }
    })

    return paymentMethod;
}

export const generatePaymentIntent = async ({amount, payment_method, branch}) => {
    const respPaymentIntent = await stripe.paymentIntents.create({
        amount: parseFloat(amount) * 100,
        currency: 'MXN',
        payment_method_types: ['card'],
        payment_method,
        description: `Para la sucursal - ${branch}`
    })

    return respPaymentIntent;
}
