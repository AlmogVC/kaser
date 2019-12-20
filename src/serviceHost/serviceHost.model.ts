import * as mongoose from 'mongoose';
import IHostService from './serviceHost.interface';
import config from '../config';

const serviceHostSchema: mongoose.Schema = new mongoose.Schema(
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
        upTimeInSeconds: {
            type: Number,
            default: 0,
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

serviceHostSchema.index({ serviceName: 1, hostname: -1 });
const ServiceHostModel = mongoose.model<IHostService & mongoose.Document>('ServiceHost', serviceHostSchema);

export default ServiceHostModel;
