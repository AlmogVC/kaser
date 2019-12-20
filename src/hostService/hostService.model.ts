import * as mongoose from 'mongoose';
import IHostService from './hostService.interface';
import config from '../config';

const hostServiceSchema: mongoose.Schema = new mongoose.Schema(
    {
        service: {
            type: String,
            required: true,
        },
        hostname: {
            type: String,
            required: true,
        },
        lastAliveSignal: {
            type: Date,
            default: new Date(),
            expires: config.hostService.expirationTimeInSeconds,
        },
    },
    {
        versionKey: false,
        autoIndex: false,
        timestamps: { createdAt: true },
        id: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret._id;
            },
        },
    },
);

hostServiceSchema.index({ serviceName: 1, hostname: -1 });
const HostServiceModel = mongoose.model<IHostService & mongoose.Document>('HostService', hostServiceSchema);

export default HostServiceModel;
