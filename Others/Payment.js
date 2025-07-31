const express = require('express');
const stripe = require('stripe')('your_stripe_secret_key');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.render('payment', {
        stripePublicKey: 'your_stripe_public_key',
        amount: 1000, // $10.00 in cents
        description: 'Sample Product',
        currency: 'inr' // For UPI payments, INR is required
    });
});

app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'inr' } = req.body;
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['card', 'upi', 'netbanking'], // Enable multiple payment methods
        });

        res.json({ 
            clientSecret: paymentIntent.client_secret,
            paymentMethods: paymentIntent.payment_method_types
        });
    } catch (err) {
        console.error('Error creating payment intent:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/process-payment', async (req, res) => {
    try {
        const { paymentMethodId, amount, currency = 'inr', paymentMethodType } = req.body;

        // For UPI payments, we need to handle them differently
        if (paymentMethodType === 'upi') {
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency,
                payment_method: paymentMethodId,
                payment_method_types: ['upi'],
                confirm: true,
                return_url: 'http://localhost:3000/success', // URL to return after UPI app authentication
            });

            if (paymentIntent.status === 'requires_action' && paymentIntent.next_action) {
                return res.json({ 
                    requiresAction: true, 
                    clientSecret: paymentIntent.client_secret,
                    paymentMethodType: 'upi'
                });
            }
        }

        // For card payments
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method: paymentMethodId,
            confirmation_method: 'manual',
            confirm: true,
        });

        if (paymentIntent.status === 'succeeded') {
            res.json({ success: true });
        } else if (paymentIntent.status === 'requires_action') {
            res.json({ 
                requiresAction: true, 
                clientSecret: paymentIntent.client_secret 
            });
        } else {
            res.json({ success: false, error: 'Payment failed' });
        }
    } catch (err) {
        console.error('Error processing payment:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/success', (req, res) => {
    res.send('<h1>Payment Successful!</h1><p>Thank you for your payment.</p>');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});