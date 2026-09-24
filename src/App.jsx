import { useEffect, useState } from "react";
import {
  useSearchParams,
  useLocation,
  Navigate,
  Routes,
  Route,
} from "react-router-dom";
import {
  Package,
  DollarSign,
  Star,
  AlertTriangle,
  Plus,
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import StatCard from "./components/StatCard";
import ProductTable from "./components/ProductTable";
import Pagination from "./components/Pagination";
import ProductFilters from "./components/ProductFilters";
import Login from "./pages/Login";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./pages/AddProduct";
import { useNavigate } from "react-router-dom";
import EditProduct from "./pages/EditProduct";
import api from "./services/api";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
   const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(
  Number(searchParams.get("page")) || 1
);

const [pageSize, setPageSize] = useState(
  Number(searchParams.get("pageSize")) || 10
);

const [search, setSearch] = useState(
  searchParams.get("search") || ""
);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");

 useEffect(() => {
  const newProduct = location.state?.newProduct;
  const updatedProduct = location.state?.updatedProduct;

  if (newProduct) {
    setProducts((prevProducts) => [
      newProduct,
      ...prevProducts.filter(
        (product) => product.id !== newProduct.id
      ),
    ]);

    setCurrentPage(1);
    setSelectedCategory("");
  }

  if (updatedProduct) {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id
          ? { ...product, ...updatedProduct }
          : product
      )
    );
  }

  if (newProduct || updatedProduct) {
    navigate("/", {
      replace: true,
      state: null,
    });
  }
}, [location.state, navigate]);

  useEffect(() => {
  const params = new URLSearchParams();

  if (currentPage > 1) {
    params.set("page", currentPage);
  }

  if (pageSize !== 10) {
    params.set("pageSize", pageSize);
  }

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (selectedCategory) {
    params.set("category", selectedCategory);
  }

  if (sortBy) {
    params.set("sort", sortBy);
  }

  setSearchParams(params);
}, [
  currentPage,
  pageSize,
  search,
  selectedCategory,
  sortBy,
  setSearchParams,
]);

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await api.get("/products/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  fetchCategories();
}, []);

useEffect(() => {
  const controller = new AbortController();

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const trimmedSearch = search.trim();

      const endpoint = trimmedSearch
        ? `/products/search?q=${encodeURIComponent(trimmedSearch)}`
        : "/products?limit=194";

      const response = await api.get(endpoint, {
        signal: controller.signal,
      });

      setProducts(response.data.products);
      setCurrentPage(1);
    } catch (error) {
      if (error.name !== "CanceledError" && error.code !== "ERR_CANCELED") {
        console.error("Failed to fetch products:", error);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const timer = setTimeout(() => {
    fetchProducts();
  }, 500);

  return () => {
    clearTimeout(timer);
    controller.abort();
  };
}, [search]);

const displayedProducts = [...products]
  .filter((product) => {
    if (!selectedCategory) {
      return true;
    }

    return product.category === selectedCategory;
  })
  .sort((a, b) => {
    if (sortBy === "price-asc") {
      return a.price - b.price;
    }

    if (sortBy === "price-desc") {
      return b.price - a.price;
    }

    if (sortBy === "rating-desc") {
      return b.rating - a.rating;
    }

    if (sortBy === "title-asc") {
      return a.title.localeCompare(b.title);
    }

    return 0;
  });

    const totalItems = displayedProducts.length;

const totalPages = Math.max(
  1,
  Math.ceil(totalItems / pageSize)
);

const startIndex = (currentPage - 1) * pageSize;

const paginatedProducts = displayedProducts.slice(
  startIndex,
  startIndex + pageSize
);

const handlePageChange = (page) => {
  if (page < 1 || page > totalPages) {
    return;
  }

  setCurrentPage(page);
};

const handleCategoryChange = (category) => {
  setSelectedCategory(category);
  setCurrentPage(1);
};

const handleSortChange = (sort) => {
  setSortBy(sort);
  setCurrentPage(1);
};

const handlePageSizeChange = (size) => {
  setPageSize(size);
  setCurrentPage(1);
};

const handleDeleteProduct = async (productId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmDelete) return;

  try {
    await api.delete(`/products/${productId}`);

    setProducts((prevProducts) =>
      prevProducts.filter(
        (product) => product.id !== productId
      )
    );
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Failed to delete product. Please try again."
    );
  }
};
const handleLogout = () => {
  localStorage.removeItem("accessToken");
  window.location.href = "/login";
};

    return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
         path="/products/add"
         element={
          <ProtectedRoute>
          <AddProduct />
           </ProtectedRoute>
           }
            />

            <Route
              path="/products/:id/edit"
              element={
               <ProtectedRoute>
                 <EditProduct />
              </ProtectedRoute>
              }
               />

      <Route
         path="/products/:id"
           element={
           <ProtectedRoute>
             <ProductDetails />
          </ProtectedRoute>
  }
/>

      <Route
        path="*"
        element={
          <ProtectedRoute>
          <div className="min-h-screen bg-slate-50">
            <div className="flex min-h-screen">
              {/* Sidebar */}
              <Sidebar
                 isOpen={isSidebarOpen}
                  onClose={() => setIsSidebarOpen(false)}
                   onLogout={handleLogout}
                  />

              {/* Main Area */}
              <div className="min-w-0 flex-1">
                {/* Navbar */}
                <Navbar
                  onMenuClick={() => setIsSidebarOpen(true)}
                  searchValue={search}
                  onSearchChange={setSearch}
                />

                {/* Dashboard Content */}
                <main className="p-4 sm:p-6 lg:p-8">
                  {/* Page Header */}
<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

  {/* Heading */}
  <div>
    <p className="text-sm font-medium text-violet-600">
      Overview
    </p>

    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
      Dashboard Overview
    </h1>

    <p className="mt-2 text-sm text-slate-500">
      Here's what's happening with your products today.
    </p>
  </div>

  {/* Add Product Button */}
  <button
    onClick={() => navigate("/products/add")}
    className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 active:scale-[0.98] sm:w-auto"
  >
    <Plus size={18} />
    Add Product
  </button>

</div>

                  {/* Product Filters */}
                  <ProductFilters
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                  />

                  {/* Stats */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                      title="Total Products"
                      value="194"
                      subtitle="Products in catalog"
                      icon={Package}
                      iconBg="bg-violet-100"
                      iconColor="text-violet-600"
                    />

                    <StatCard
                      title="Total Revenue"
                      value="$24,580"
                      subtitle="+12.5% from last month"
                      icon={DollarSign}
                      iconBg="bg-emerald-100"
                      iconColor="text-emerald-600"
                    />

                    <StatCard
                      title="Average Rating"
                      value="4.6"
                      subtitle="Across all products"
                      icon={Star}
                      iconBg="bg-amber-100"
                      iconColor="text-amber-600"
                    />

                    <StatCard
                      title="Low Stock"
                      value="12"
                      subtitle="Products need attention"
                      icon={AlertTriangle}
                      iconBg="bg-red-100"
                      iconColor="text-red-600"
                    />
                  </div>

                  {/* Product Table */}
                  <div className="mt-6">
                    <ProductTable
                     products={paginatedProducts}
                      loading={loading}
                      onDelete={handleDeleteProduct}
                       />

                    {!loading && totalItems > 0 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        totalItems={totalItems}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                      />
                    )}
                  </div>
                </main>
              </div>
            </div>
          </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;