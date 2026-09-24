import {
  LayoutDashboard,
  Package,
  Tags,
  BarChart3,
  Settings,
  LogOut,
  X,
} from "lucide-react";

function Sidebar({ isOpen, onClose, onLogout }) {
  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      active: true,
    },
    {
      name: "Products",
      icon: Package,
    },
    {
      name: "Categories",
      icon: Tags,
    },
    {
      name: "Analytics",
      icon: BarChart3,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-72 flex-col
          border-r border-slate-200 bg-white
          transition-transform duration-300
          lg:static lg:z-auto lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-lg font-bold text-white shadow-lg shadow-violet-200">
              N
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Nexgensis
              </h1>

              <p className="text-xs text-slate-400">
                Admin Panel
              </p>
            </div>
          </div>

          {/* Close button - mobile */}
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`
                  flex w-full items-center gap-3 rounded-xl px-4 py-3
                  text-sm font-medium transition-all
                  ${
                    item.active
                      ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                      : "text-slate-600 hover:bg-violet-50 hover:text-violet-600"
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-slate-100 p-4">
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            <Settings size={20} />
            <span>Settings</span>
          </button>

          <button
           onClick={onLogout}
             className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
              >
             <LogOut size={20} />
              <span>Logout</span>
              </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;