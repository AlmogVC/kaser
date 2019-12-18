import * as mongoose from 'mongoose';
import IAliveSignal from './aliveSignal.interface';

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
