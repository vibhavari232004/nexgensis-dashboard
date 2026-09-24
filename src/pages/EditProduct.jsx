import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import api from "../services/api";

function EditProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Get the product passed from ProductTable
  const product = location.state?.product;
  const [loadedProduct, setLoadedProduct] = useState(product);
const [fetchingProduct, setFetchingProduct] = useState(!product);
const [fetchError, setFetchError] = useState("");

useEffect(() => {
  if (product) {
    setLoadedProduct(product);
    setFetchingProduct(false);
    return;
  }

  const fetchProduct = async () => {
    try {
      setFetchingProduct(true);
      setFetchError("");

      const response = await api.get(`/products/${id}`);

      const fetchedProduct = response.data;

      setLoadedProduct(fetchedProduct);

      setFormData({
        title: fetchedProduct.title || "",
        price: fetchedProduct.price ?? "",
        category: fetchedProduct.category || "",
        stock: fetchedProduct.stock ?? "",
        description: fetchedProduct.description || "",
      });
    } catch (error) {
      setFetchError(
        error.response?.data?.message ||
          "Unable to load product information."
      );
    } finally {
      setFetchingProduct(false);
    }
  };

  fetchProduct();
}, [id, product]);

  const [formData, setFormData] = useState({
    title: product?.title || "",
    price: product?.price ?? "",
    category: product?.category || "",
    stock: product?.stock ?? "",
    description: product?.description || "",
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
      const response = await api.put(`/products/${id}`, {
        title: formData.title.trim(),
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        description: formData.description.trim(),
      });

      setSuccess("Product updated successfully!");

      setTimeout(() => {
        navigate("/", {
          state: {
            updatedProduct: response.data,
          },
        });
      }, 1000);
    } catch (error) {
      setErrors({
        api:
          error.response?.data?.message ||
          "Failed to update product. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

if (fetchingProduct) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="text-lg font-medium text-violet-600">
        Loading product...
      </p>
    </div>
  );
}

if (!loadedProduct) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-4">
      <h2 className="text-xl font-bold text-slate-800">
        {fetchError || "Product information not found."}
      </h2>

      <button
        onClick={() => navigate("/")}
        className="rounded-xl bg-violet-600 px-5 py-3 text-white"
      >
        Back to Dashboard
      </button>
    </div>
  );
}

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100";

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl">

        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm hover:text-violet-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-slate-900">
              Edit Product
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Update the product details below.
            </p>
          </div>

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

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Product Name *
              </label>

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
              />

              {errors.title && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.title}
                </p>
              )}
            </div>

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
                  className={inputClass}
                />

                {errors.stock && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.stock}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Category *
              </label>

              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
              />

              {errors.category && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Description *
              </label>

              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={inputClass}
              />

              {errors.description && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
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

export default EditProduct;