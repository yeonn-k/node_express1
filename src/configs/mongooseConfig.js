import mongoose from 'mongoose';

export const connectMongoose = async () => {
    try {
        const MONGODB_URI = 'mongodb://localhost:27017/board';
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to mongodb...');
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}