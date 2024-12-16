const tf = require('@tensorflow/tfjs-node');
const { Storage } = require('@google-cloud/storage');

const BUCKET_ML = process.env.BUCKET_ML || 'titipin-ml';
const MODEL_FILE_PATH = 'purchase_recommendations/purchase_recommendation.h5';

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID || 'titipin-441607',
  keyFilename: './serviceAccountKey.json', // Path ke service account key
});

let recommendationModel = null;

// Function to load model from Google Cloud Storage
const loadRecommendationModel = async () => {
  if (!recommendationModel) {
    console.log('Fetching ML model from Google Cloud Storage...');
    const localModelPath = './temp_purchase_recommendation.h5';

    try {
      // Get bucket and download file locally
      const bucket = storage.bucket(BUCKET_ML);
      const file = bucket.file(MODEL_FILE_PATH);

      await file.download({ destination: localModelPath });
      console.log(`Model downloaded to ${localModelPath}`);

      // Load model into TensorFlow.js
      recommendationModel = await tf.loadLayersModel(`file://${localModelPath}`);
      console.log('Model successfully loaded.');
    } catch (error) {
      console.error('Error loading ML model:', error);
      throw new Error('Failed to load recommendation model');
    }
  }
  return recommendationModel;
};

// Function to generate product recommendations
const generateRecommendations = async (products) => {
  const model = await loadRecommendationModel();

  // Prepare product features (id, price, quantity)
  const productFeatures = products.map((p) => [p.id, p.price, p.quantity]);
  const tensorInput = tf.tensor2d(productFeatures);

  // Generate predictions
  const predictions = model.predict(tensorInput).arraySync();

  // Combine predictions with products and sort by score
  const recommendedProducts = predictions
    .map((score, idx) => ({ ...products[idx], score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // Limit to 10 recommendations

  return recommendedProducts;
};

// Export functions
module.exports = { loadRecommendationModel, generateRecommendations };
