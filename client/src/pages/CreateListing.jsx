import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [imageUrls, setImageUrls] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
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

  const currentUser = useSelector((state) => state.user);
  const token = currentUser?.token;
  console.log("currentUser:", currentUser);

  useEffect(() => {
    if (currentUser?.currentUser?._id) {
      setFormData((prev) => ({
        ...prev,
        userRef: currentUser.currentUser._id,
      }));
    }
  }, [currentUser]);

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

    if (validFiles.length + files.length > 6) {
      toast.error("You can upload up to 6 images total.");
      return;
    }

    setFiles((prev) => [...prev, ...validFiles]);

    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleImageUpload = async () => {
    if (files.length === 0) return toast.error("Please select images first.");
    if (files.length > 6) return toast.error("You can upload up to 6 images.");

    try {
      setUploading(true);
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

      setImageUrls(res.data.imageUrls);
      toast.success("Images uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed.");
    } finally {
      setUploading(false); 
    }
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    if (imageUrls.length === 0)
      return toast.error("Please upload images first.");
    if (+formData.regularPrice < +formData.discountPrice)
      return toast.error("Invalid Discount price");

    try {
      const listingData = {
        ...formData,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        regularPrice: Number(formData.regularPrice),
        discountPrice: Number(formData.discountPrice),
        imageUrls,
      };

      console.log("Listing data before submission:", listingData);

      await axios.post("/api/listings/create", listingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Listing created successfully!");
      setFormData({
        name: "",
        description: "",
        address: "",
        type: "",
        bedrooms: 0,
        bathrooms: 0,
        regularPrice: 0,
        discountPrice: 0,
        parking: false,
        furnished: false,
        offer: false,
      });
  
      setImageUrls([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create listing.");
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
    setPreviewUrls((prevUrls) =>
      prevUrls.filter((_, index) => index !== indexToRemove)
    );
  };

  const isSubmitDisabled =
    !formData.name || !formData.description || imageUrls.length === 0;

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-white dark:bg-slate-950">
      <main className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">
          Create a Listing
        </h1>
        <form
          className="flex flex-col sm:flex-row gap-4"
          onSubmit={handleCreateListing}
        >
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              placeholder="Name"
              className="border border-slate-300 dark:border-white p-3 rounded-lg bg-white dark:bg-slate-900"
              id="name"
              maxLength="62"
              minLength="10"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              className="border border-slate-300 dark:border-white p-3 rounded-lg bg-white dark:bg-slate-900"
              id="description"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Address"
              className="border border-slate-300 dark:border-white p-3 rounded-lg bg-white dark:bg-slate-900"
              id="address"
              required
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />

            <div className="flex gap-6 flex-wrap">
              {["sell", "rent"].map((type) => (
                <div className="flex gap-2" key={type}>
                  <input
                    type="radio"
                    id={type}
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-5"
                  />
                  <label htmlFor={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </label>
                </div>
              ))}

              {["parking", "furnished", "offer"].map((field) => (
                <div className="flex gap-2" key={field}>
                  <input
                    type="checkbox"
                    id={field}
                    className="w-5"
                    checked={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.checked })
                    }
                  />
                  <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-6">
                {[
                  { id: "bedrooms", label: "Beds" },
                  { id: "bathrooms", label: "Baths" },
                ].map(({ id, label }) => (
                  <div className="flex items-center  gap-2" key={id}>
                    <input
                      type="number"
                      id={id}
                      min="1"
                      required
                      placeholder="0"
                      className="p-3 border border-slate-900 dark:border-white w-20 text-center rounded-lg bg-white dark:bg-slate-900"
                      value={formData[id]}
                      onChange={(e) =>
                        setFormData({ ...formData, [id]: e.target.value })
                      }
                    />
                    <div className="flex flex-col items-start">
                      <p>{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-6 items-start md:items-start sm:items-center">
                {/* Regular Price */}
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    id="regularPrice"
                    min="1"
                    required
                    className="p-3 border border-slate-900 dark:border-white rounded-lg text-center w-56 bg-white dark:bg-slate-900"
                    value={formData.regularPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, regularPrice: e.target.value })
                    }
                  />
                  <div className="flex flex-col items-start text-sm">
                    <p className="font-medium">Regular price</p>
                    <span className="text-xs text-slate-600 dark:text-slate-300">($/month)</span>
                  </div>
                </div>

                {/* Discount Price (only if offer is true) */}
                {formData.offer && (
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      id="discountPrice"
                      min="1"
                      required
                      className="p-3 border border-slate-900 dark:border-white rounded-lg text-center w-56 bg-white dark:bg-slate-900"
                      value={formData.discountPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountPrice: e.target.value,
                        })
                      }
                    />
                    <div className="flex flex-col items-start text-sm">
                      <p className="font-medium">Discounted price</p>
                      <span className="text-xs text-slate-600 dark:text-slate-300">($/month)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <br /><br />

          <div className="flex flex-col flex-1 gap-4">
            <p className="font-semibold">
              Images:
              <span className="font-normal text-slate-600 dark:text-slate-300 ml-2">
                First image is cover - Max. 6
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
                onChange={handleFileChange}
                type="file"
                className="hidden"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                onClick={handleImageUpload}
                type="button"
                className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>

            {previewUrls.length > 0 && (
              <div className="flex flex-col gap-4 mt-4">
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="border border-slate-300 dark:border-white p-2 rounded flex justify-between items-center"
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-contain rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="ml-4 px-4 py-2 text-white bg-red-700 rounded-lg uppercase hover:bg-red-800 transition"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              className="p-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitDisabled}
            >
              Create Listing
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
