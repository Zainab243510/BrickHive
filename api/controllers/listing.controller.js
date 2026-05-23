import Listing from '../models/listing.model.js';
import mongoose from 'mongoose';

export const createListing = async (req, res, next) => {
    try {
        const {
            name,
            description,
            address,
            regularPrice,
            discountPrice,
            bathrooms,
            bedrooms,
            furnished,
            parking,
            offer,
            type,
            imageUrls,
            userRef,
        } = req.body;

        const newListing = new Listing({
            name,
            description,
            address,
            regularPrice,
            discountPrice,
            bathrooms,
            bedrooms,
            furnished,
            parking,
            offer,
            type,
            imageUrls,
            userRef,
        });

        const savedListing = await newListing.save();
        return res.status(201).json(savedListing);
    } catch (error) {
        next(error);
    }
};

export const uploadImages = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No images provided.' });
        }
        const imageUrls = req.files.map(file => file.path);

        return res.status(200).json({ imageUrls });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Image upload failed.' });
    }
};

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
    }
    if (req.user.id !== listing.userRef) {
        return res.status(403).json({ message: 'You are not authorized to delete this listing' });
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'Listing deleted successfully' });

    } catch (error) {
        next(error);
    }
}

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
    }
    if (req.user.id !== listing.userRef) {
        return res.status(403).json({ message: 'You are not authorized to update this listing' });
    }
    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json(updatedListing);
    }

    catch (error) {
        next(error);
    }

}

export const getListing = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid listing ID" });
    }

    try {
        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        if (req.user && req.user.id !== listing.userRef) {
            listing.views = listing.views + 1;
            await listing.save();
        }

        return res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
};
export const getListings = async (req, res, next) => {
    try {

        const limit = parseInt(req.query.limit) || 12;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;
        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
        }
        let furnished = req.query.furnished;
        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
        }
        let parking = req.query.parking;
        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
        }
        let type = req.query.type;
        if (type === undefined || type === 'all') {
            type = { $in: ['rent', 'sell'] };
        }
        // Default: hide sold/rented. Use $nin (not equality) so legacy
        // listings created before the `status` field was added still appear.
        // Search passes status=all to include sold/rented (with a badge).
        let status;
        if (req.query.status === 'all') {
            status = undefined;
        } else {
            status = { $nin: ['sold', 'rented'] };
        }
        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';

        const searchFilter = searchTerm
            ? {
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } },
                ],
            }
            : {};

        const listings = await Listing.find({
            ...searchFilter,
            offer,
            furnished,
            parking,
            type,
            ...(status !== undefined && { status }),
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);
        return res.status(200).json(listings);


    } catch (error) {
        console.error("Error fetching listings:", error);
        return res.status(500).json({ message: "Failed to fetch listings" });
    }
};
export const getAllListings = async (req, res) => {
    try {
        const listings = await Listing.find();
        res.status(200).json(listings);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch listings" });
    }
}
export const getTopListings = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const topListings = await Listing.find({ userRef: userId })
      .sort({ views: -1 })
      .limit(5);

    // Always return a consistent structure
    return res.status(200).json({
      topListings,
      message: topListings.length === 0 ? "No top listings found, returning zero." : "Success",
    });
  } catch (error) {
    next(error);
  }
};



