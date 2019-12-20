import * as mongoose from 'mongoose';
import IService from './service.interface';

const serviceSchema: mongoose.Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
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
        autoIndex: false,
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

serviceSchema.index({ name: 1 });
const ServiceModel = mongoose.model<IService & mongoose.Document>('Service', serviceSchema);

export default ServiceModel;
