import * as mongoose from 'mongoose';
import IAliveSignal from './aliveSignal.interface';

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
    },
    {
        versionKey: false,
        autoIndex: false,
        timestamps: { createdAt: true, updatedAt: false },
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
