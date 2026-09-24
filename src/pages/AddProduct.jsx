import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, AlertCircle } from "lucide-react";
import api from "../services/api";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Product name is required.";
    }

    if (formData.price === "" || Number(formData.price) <= 0) {
      newErrors.price = "Enter a price greater than 0.";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category.";
    }

    if (
      formData.stock === "" ||
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      newErrors.stock = "Enter a valid stock quantity.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/products/add", {
        title: formData.title.trim(),
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        description: formData.description.trim(),
      });

      console.log("Product added:", response.data);

      setSuccess("Product added successfully!");

      setTimeout(() => {
  navigate("/", {
    state: {
      newProduct: response.data,
    },
  });
}, 1200);
    } catch (error) {
      setErrors({
        api:
          error.response?.data?.message ||
          "Failed to add product. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100";

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl">

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm hover:text-violet-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        {/* Form Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Header */}
          <div className="border-b border-slate-100 p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                <Plus size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Add New Product
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the details to add a product to your inventory.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 sm:p-8"
          >
            {errors.api && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {errors.api}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                {success}
              </div>
            )}

            {/* Product Name */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Product Name *
              </label>

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter product name"
                className={inputClass}
              />

              {errors.title && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Price and Stock */}
            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Price ($) *
                </label>

                <input
                  type="number"
                  name="price"
                  min="0.01"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={inputClass}
                />

                {errors.price && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Stock Quantity *
                </label>

                <input
                  type="number"
                  name="stock"
                  min="0"
                  step="1"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                  className={inputClass}
                />

                {errors.stock && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.stock}
                  </p>
                )}
              </div>

            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select a category</option>
                <option value="beauty">Beauty</option>
                <option value="fragrances">Fragrances</option>
                <option value="furniture">Furniture</option>
                <option value="groceries">Groceries</option>
                <option value="laptops">Laptops</option>
                <option value="mens-shirts">Mens Shirts</option>
                <option value="mens-shoes">Mens Shoes</option>
                <option value="mobile-accessories">Mobile Accessories</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="skin-care">Skin Care</option>
                <option value="smartphones">Smartphones</option>
                <option value="sports-accessories">Sports Accessories</option>
                <option value="sunglasses">Sunglasses</option>
                <option value="tablets">Tablets</option>
                <option value="tops">Tops</option>
                <option value="vehicle">Vehicle</option>
                <option value="womens-bags">Womens Bags</option>
                <option value="womens-dresses">Womens Dresses</option>
                <option value="womens-jewellery">Womens Jewellery</option>
                <option value="womens-shoes">Womens Shoes</option>
                <option value="womens-watches">Womens Watches</option>
              </select>

              {errors.category && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Description *
              </label>

              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                className={inputClass}
              />

              {errors.description && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Plus size={18} />
                    Save Product
                  </>
                )}
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;