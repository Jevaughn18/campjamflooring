// Load environment variables
import 'dotenv/config';

// Import the app using tsx loader
import('../server/index.ts').then(module => {
  // Export the Express app
  module.default;
}).catch(err => {
  console.error('Failed to load server:', err);
});

// Placeholder export - will be replaced by dynamic import
export default async function handler(req, res) {
  try {
    const { default: app } = await import('../server/index.ts');
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: error.message });
  }
}
