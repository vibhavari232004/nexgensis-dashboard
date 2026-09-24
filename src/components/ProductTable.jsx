import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Pencil, Trash2, Star } from "lucide-react";

function ProductTable({ products, loading, onDelete }) {
    const navigate = useNavigate();
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="py-16 text-center">
          <h3 className="text-lg font-semibold text-slate-900">
            No products found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Try changing your search or filter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      
      {/* Table Header */}
      <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Products
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your product inventory
          </p>
        </div>

        <span className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-600">
          {products.length} Products
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Product
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Category
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Price
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Rating
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Stock
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr
                 key={product.id}
                 onClick={() => navigate(`/products/${product.id}`)}
                   className="cursor-pointer transition hover:bg-violet-50/50"
                   >
                {/* Product */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="h-12 w-12 rounded-xl object-cover ring-1 ring-slate-200"
                    />

                    <div className="min-w-0">
                      <p className="max-w-[220px] truncate text-sm font-semibold text-slate-800">
                        {product.title}
                      </p>

                      <p className="text-xs text-slate-400">
                        ID #{product.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-5 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                    {product.category}
                  </span>
                </td>

                {/* Price */}
                <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                  ${product.price}
                </td>

                {/* Rating */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <Star
                      size={15}
                      className="fill-amber-400 text-amber-400"
                    />

                    <span className="text-sm font-medium text-slate-700">
                      {product.rating}
                    </span>
                  </div>
                </td>

                {/* Stock */}
                <td className="px-5 py-4">
                  <span
                    className={`text-sm font-semibold ${
                      product.stock < 10
                        ? "text-red-500"
                        : "text-emerald-600"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>

                {/* Action */}
                <td className="px-5 py-4 text-right">
                  <div className="relative group">
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();

      const menu = e.currentTarget.nextElementSibling;
      menu.classList.toggle("hidden");
    }}
    className="rounded-lg p-2 text-slate-400 transition hover:bg-violet-100 hover:text-violet-700"
    aria-label="Product actions"
  >
    <MoreHorizontal size={20} />
  </button>

  <div
    className="hidden absolute right-0 top-full z-50 mt-1 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
    onClick={(e) => e.stopPropagation()}
  >
    <button
      type="button"
      onClick={() =>
        navigate(`/products/${product.id}/edit`, {
          state: { product },
        })
      }
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-violet-50"
    >
      <Pencil size={16} />
      Edit
    </button>

    <button
      type="button"
     onClick={(e) => {
  e.preventDefault();
  e.stopPropagation();
  onDelete(product.id);
}}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
    >
      <Trash2 size={16} />
      Delete
    </button>
  </div>
</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="divide-y divide-slate-100 md:hidden">
        {products.map((product) => (
          <div
            key={product.id}
           onClick={() => navigate(`/products/${product.id}`)}
            className="cursor-pointer p-4 transition hover:bg-violet-50/50"
               >
            <div className="flex gap-3">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-slate-200"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="truncate text-sm font-semibold text-slate-800">
                      {product.title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      ID #{product.id}
                    </p>
                  </div>

                  <button className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                    <MoreHorizontal size={19} />
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                    {product.category}
                  </span>

                  <span className="text-sm font-bold text-slate-800">
                    ${product.price}
                  </span>

                  <span className="flex items-center gap-1 text-xs font-medium text-slate-600">
                    <Star
                      size={13}
                      className="fill-amber-400 text-amber-400"
                    />
                    {product.rating}
                  </span>

                  <span
                    className={`text-xs font-semibold ${
                      product.stock < 10
                        ? "text-red-500"
                        : "text-emerald-600"
                    }`}
                  >
                    Stock: {product.stock}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductTable;