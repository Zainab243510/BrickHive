import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        regularPrice: {
            type: Number,
            required: true,
        },
        discountPrice: {
            type: Number,
            required: true,
        },
        bathrooms: {
            type: Number,
            required: true,
        },
        bedrooms: {
            type: Number,
            required: true,
        },
        furnished: {
            type: Boolean,
            required: true,
        },
        parking: {
            type: Boolean,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        offer: {
            type: Boolean,
            required: true,
        },
        imageUrls: {
            type: [String],
            required: true,
            validate: {
                validator: function (arr) {
                    return arr.length >= 1 && arr.length <= 6;
                },
                message: 'You must upload between 1 and 6 images.',
            },
        },
        userRef: {
            type: String,
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['available', 'sold', 'rented'],
            default: 'available',
        },

    }, { timestamps: true }
)
const Listing = mongoose.model('Listing', listingSchema);

export default Listing;