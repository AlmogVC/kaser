import * as mongoose from 'mongoose';
import IAliveSignal from './aliveSignal.interface';
import config from '../config';

// TODO: Remove document after specified (in config) amount of time.
const aliveSignalSchema: mongoose.Schema = new mongoose.Schema(
    {
        serviceName: {
            type: String,
            required: true,
        },
        hostname: {
            type: String,
            required: true,
        },
        upTimeInSeconds: {
            type: Number,
            required: true,
        },
        aliveDate: {
            type: Date,
            required: true,
        },
        createdAt: {
            type: Date,
            default: new Date(),
            expires: config.aliveSignal.expirationTimeInSeconds,
        },
    },
    {
        versionKey: false,
        autoIndex: false,
        id: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret._id;
            },
        },
    },
);

aliveSignalSchema.index({ serviceName: 1, hostname: -1 });
const AliveSignalModel = mongoose.model<IAliveSignal & mongoose.Document>('AliveSignal', aliveSignalSchema);

export default AliveSignalModel;
