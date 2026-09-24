import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Package } from "lucide-react";
import api from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">
          Product not found
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

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">

        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm hover:text-violet-600"
        >
          <ArrowLeft size={18} />
          Back to Products
        </button>

        <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-2">

          {/* Product Image */}
          <div className="flex min-h-72 items-center justify-center rounded-2xl bg-slate-50 p-6">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="max-h-96 w-full object-contain"
            />
          </div>

          {/* Product Information */}
          <div className="flex flex-col">

            <span className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold capitalize text-violet-600">
              {product.category}
            </span>

            <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
              {product.title}
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              {product.description}
            </p>

            <div className="mt-5 flex items-center gap-2">
              <Star
                size={18}
                className="fill-amber-400 text-amber-400"
              />
              <span className="font-semibold text-slate-800">
                {product.rating}
              </span>
              <span className="text-sm text-slate-400">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <div>
                <p className="text-sm text-slate-500">Price</p>
                <p className="mt-1 text-3xl font-bold text-violet-600">
                  ${product.price}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-500">Stock</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {product.stock} units
                </p>
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-8">
              <h2 className="mb-4 text-lg font-bold text-slate-900">
                Customer Reviews
              </h2>

              {product.reviews?.length > 0 ? (
                <div className="space-y-3">
                  {product.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-100 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-800">
                          {review.reviewerName}
                        </p>

                        <span className="flex items-center gap-1 text-sm text-amber-500">
                          <Star size={14} className="fill-amber-400" />
                          {review.rating}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No reviews available.
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;