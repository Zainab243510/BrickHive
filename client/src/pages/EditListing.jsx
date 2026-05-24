import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

export default function EditListing() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user);
  const token = currentUser?.token;

  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    regularPrice: 0,
    discountPrice: 0,
    bathrooms: 0,
    bedrooms: 0,
    furnished: false,
    parking: false,
    offer: false,
    type: "",
    userRef: "",
  });
  useEffect(() => {
    const fetchListing = async () => {
      console.log("Listing ID:", listingId);

      if (!isValidObjectId(listingId)) {
        console.error("Invalid listing ID format.");
        return;
      }

      try {
        const response = await axios.get(`/api/listings/get/${listingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);

        const listing = response.data; 
        setFormData({
          ...formData,
          name: listing.name,
          description: listing.description,
          address: listing.address,
          regularPrice: listing.regularPrice,
          discountPrice: listing.discountPrice,
          bathrooms: listing.bathrooms,
          bedrooms: listing.bedrooms,
          furnished: listing.furnished,
          parking: listing.parking,
          offer: listing.offer,
          type: listing.type,
          userRef: listing.userRef,
        });
        setImageUrls(listing.imageUrls); 
      } catch (error) {
        console.error("Error fetching listing:", error);
        toast.error("Error fetching listing.");
      }
    };

    fetchListing();
  }, [listingId]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const MAX_SIZE = 5 * 1024 * 1024;
    const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];

    const validFiles = selectedFiles.filter((file) => {
      const isValidSize = file.size <= MAX_SIZE;
      const isValidFormat = ALLOWED_FORMATS.includes(file.type);
      if (!isValidSize) toast.error(`${file.name} is too large. Max 5MB.`);
      if (!isValidFormat) toast.error(`${file.name} has invalid format.`);
      return isValidSize && isValidFormat;
    });

    if (validFiles.length + files.length > 6 - imageUrls.length) {
      toast.error("You can upload up to 6 images total.");
      return;
    }

    setFiles((prev) => [...prev, ...validFiles]);
    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleImageUpload = async () => {
    if (files.length === 0) return toast.error("Please select images first.");
    try {
      const imageFormData = new FormData();
      files.forEach((file) => imageFormData.append("images", file));

      const res = await axios.post(
        "/api/listings/upload-images",
        imageFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setImageUrls((prev) => [...prev, ...res.data.imageUrls]);
      setFiles([]);
      setPreviewUrls([]);
      toast.success("Images uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed.");
    }
  };

  const handleRemoveImage = (indexToRemove, fromPreview = false) => {
    if (fromPreview) {
      setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
      setPreviewUrls((prev) => prev.filter((_, i) => i !== indexToRemove));
    } else {
      setImageUrls((prev) => prev.filter((_, i) => i !== indexToRemove));
    }
  };

  const handleUpdateListing = async (e) => {
    e.preventDefault();

    if (imageUrls.length === 0)
      return toast.error("Upload at least one image.");
    if (+formData.discountPrice > +formData.regularPrice)
      return toast.error("Discount price cannot be more than regular price.");

    try {
      const listingData = {
        ...formData,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        regularPrice: Number(formData.regularPrice),
        discountPrice: Number(formData.discountPrice),
        imageUrls,
      };

      await axios.post(`/api/listings/editListing/${listingId}`, listingData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Listing updated!");
      navigate(`/listing/${listingId}`);     
    } catch (err) {
      console.error(err);
      toast.error("Failed to update listing.");
    }
  };

  const isSubmitDisabled =
    !formData.name || !formData.description || imageUrls.length === 0;

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-white dark:bg-slate-950">
      <main className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">
          Update Listing
        </h1>
        <form
          className="flex flex-col sm:flex-row gap-4"
          onSubmit={handleUpdateListing}
        >
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              placeholder="Name"
              className="border border-slate-300 dark:border-white p-3 rounded-lg bg-white dark:bg-slate-900"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              minLength="10"
              maxLength="62"
            />
            <textarea
              placeholder="Description"
              className="border border-slate-300 dark:border-white p-3 rounded-lg bg-white dark:bg-slate-900"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Address"
              className="border border-slate-300 dark:border-white p-3 rounded-lg bg-white dark:bg-slate-900"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
            <div className="flex gap-6 flex-wrap">
              {["sell", "rent"].map((type) => (
                <div className="flex gap-2" key={type}>
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-5"
                  />
                  <label>{type.charAt(0).toUpperCase() + type.slice(1)}</label>
                </div>
              ))}
              {["parking", "furnished", "offer"].map((field) => (
                <div className="flex gap-2" key={field}>
                  <input
                    type="checkbox"
                    checked={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.checked })
                    }
                    className="w-5"
                  />
                  <label>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-6">
                {[
                  { id: "bedrooms", label: "Beds" },
                  { id: "bathrooms", label: "Baths" },
                ].map(({ id, label }) => (
                  <div className="flex items-center gap-2" key={id}>
                    <input
                      type="number"
                      id={id}
                      min="1"
                      required
                      placeholder="0"
                      className="p-3 border border-slate-900 dark:border-white w-20 rounded-lg text-center bg-white dark:bg-slate-900"
                      value={formData[id]}
                      onChange={(e) =>
                        setFormData({ ...formData, [id]: e.target.value })
                      }
                    />
                    <p className="text-sm font-semibold">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2 ">
                
                <input
                  type="number"
                  min="1"
                  className="border border-slate-900 dark:border-white p-3 rounded-lg w-56 text-center bg-white dark:bg-slate-900"
                  value={formData.regularPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, regularPrice: e.target.value })
                  }
                  required
                />
                 <div className="flex flex-col items-start text-sm">
                    <p className="font-medium">Regular price</p>
                    <span className="text-xs text-slate-600 dark:text-slate-300">($/month)</span>
                  </div>
              </div>
              {formData.offer && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    className="border border-slate-900 dark:border-white p-3 rounded-lg w-56 text-center bg-white dark:bg-slate-900"
                    value={formData.discountPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountPrice: e.target.value,
                      })
                    }
                    required
                  />
                   <div className="flex flex-col items-start text-sm">
                      <p className="font-medium">Discounted price</p>
                      <span className="text-xs text-slate-600 dark:text-slate-300">($/month)</span>
                    </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 gap-4">
            <p className="font-semibold">
              Images:
              <span className="text-sm text-slate-600 dark:text-slate-300 ml-2">
                First image is cover - Max 6
              </span>
            </p>

            <div className="flex gap-4">
              <label
                htmlFor="images"
                className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg cursor-pointer w-full text-center"
              >
                Choose File
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="images"
              />
              <button
                type="button"
                onClick={handleImageUpload}
                className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg"
              >
                Upload
              </button>
            </div>

            {[...imageUrls, ...previewUrls].map((url, index) => (
              <div
                key={index}
                className="flex justify-between items-center border border-slate-300 dark:border-white p-2 rounded"
              >
                <img
                  src={url}
                  alt={`Image ${index}`}
                  className="w-20 h-20 object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveImage(index, index >= imageUrls.length)
                  }
                  className="ml-4 px-4 py-2 text-white bg-red-700 rounded-lg uppercase hover:bg-red-800 transition"
                >
                  Delete
                </button>
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="p-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Listing
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
