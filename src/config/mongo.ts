import mongoose from 'mongoose';
import debug from 'debug';

const log: debug.IDebugger = debug('app:mongoose-service');

class MongooseService {
     count = 0;
     mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        useFindAndModify: false,
    };

    constructor() {
        this.connectWithRetry();
    }

    getMongoose() {
        return mongoose;
    }

    async connectWithRetry(){
        log('Attempting MongoDB connection (will retry if needed)');
        mongoose
            .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/testing', this.mongooseOptions)
            .then(() => {
                console.log('MongoDB is connected');
            })
            .catch((err) => {
                const retrySeconds = 5;
                console.log(
                    `MongoDB connection unsuccessful (will retry #${++this
                        .count} after ${retrySeconds} seconds):`,
                    err
                );
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });
    };
}
export default  new MongooseService();