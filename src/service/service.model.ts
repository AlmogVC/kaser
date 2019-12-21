import * as mongoose from 'mongoose';
import IService from './service.interface';
import config from '../config';

const serviceSchema: mongoose.Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            index: true,
            immutable: true,
        },
        lastContactDate: {
            type: Date,
            required: true,
        },
        longestDeadPeriodInSeconds: {
            type: Number,
            required: true,
            default: 0,
        },
        longestAlivePeriodInSeconds: {
            type: Number,
            required: true,
            default: 0,
        },
        currentAlivePeriodInSeconds: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        versionKey: false,
        autoIndex: config.db.autoIndex,
        timestamps: { createdAt: true, updatedAt: true },
        id: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret._id;
            },
        },
    },
);

const ServiceModel = mongoose.model<IService & mongoose.Document>('Service', serviceSchema);

export default ServiceModel;
