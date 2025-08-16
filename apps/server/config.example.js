// Example configuration file
// Copy this to config.js and fill in your actual values

export const config = {
	// Database
	database: {
		url: process.env.DATABASE_URL
	},

	// Server
	server: {
		port: process.env.PORT || 3001,
		nodeEnv: process.env.NODE_ENV || 'development'
	},

	// JWT
	jwt: {
		secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here'
	},

	// Stripe
	stripe: {
		secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_secret_key',
		publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key'
	},

	// Razorpay
	razorpay: {
		keyId: process.env.RAZORPAY_KEY_ID || 'your_razorpay_key_id',
		keySecret: process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret'
	}
};
