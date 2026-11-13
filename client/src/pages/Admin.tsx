import { ArrowLeft, BarChart3, Boxes, ClipboardList, LogOut, Package, Plus, Settings2, UsersRound } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";

const stats = [
  { label: "Total orders", value: "24", note: "+12% this month", icon: ClipboardList },
  { label: "Products", value: "48", note: "6 low in stock", icon: Boxes },
  { label: "Available stock", value: "312", note: "Across 3 categories", icon: Package },
  { label: "Sales overview", value: "₦428k", note: "This month", icon: BarChart3 },
];

export default function Admin() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) return <div className="admin-loading">Loading your workspace…</div>;
  if (!isAuthenticated) return <div className="admin-login"><span className="brand-mark">✦</span><h1>Anikks admin</h1><p>Sign in with your Manus account to manage products, orders and site content.</p><button className="admin-primary" onClick={() => startLogin()}>Sign in to continue</button><a href="/">Return to storefront</a></div>;
  if (user?.role !== "admin") return <div className="admin-login"><span className="brand-mark">✦</span><h1>Access requested</h1><p>Your account is signed in, but it does not have administrator access yet.</p><a href="/">Return to storefront</a></div>;

  return <div className="admin-shell"><aside className="admin-sidebar"><a href="/" className="brand inverse"><span className="brand-mark">✦</span><span>anikks<small>admin studio</small></span></a><nav><a className="active" href="#dashboard"><BarChart3 size={17} /> Overview</a><a href="#products"><Boxes size={17} /> Products</a><a href="#orders"><ClipboardList size={17} /> Orders</a><a href="#content"><Settings2 size={17} /> Site content</a><a href="#customers"><UsersRound size={17} /> Customers</a></nav><button className="admin-logout" onClick={() => logout()}><LogOut size={16} /> Sign out</button></aside><main className="admin-main"><div className="admin-top"><div><a className="back-link" href="/"><ArrowLeft size={15} /> Storefront</a><h1>Good morning, {user?.name?.split(" ")[0] || "Admin"}.</h1><p>Here’s what’s happening across Anikks today.</p></div><button className="admin-primary"><Plus size={16} /> Add product</button></div><section className="admin-stats" id="dashboard">{stats.map((stat) => <div className="admin-stat" key={stat.label}><stat.icon size={18} /><span>{stat.label}</span><strong>{stat.value}</strong><small>{stat.note}</small></div>)}</section><section className="admin-panel" id="orders"><div className="panel-heading"><div><span className="admin-eyebrow">Needs attention</span><h2>Recent orders</h2></div><button className="panel-link">View all orders</button></div><div className="order-table"><div className="order-row order-head"><span>Order</span><span>Customer</span><span>Status</span><span>Total</span></div>{[["#AN-024", "Amaka M.", "Pending", "₦18,500"], ["#AN-023", "Tolu A.", "Processing", "₦42,000"], ["#AN-022", "Kemi O.", "Dispatched", "₦9,500"], ["#AN-021", "David A.", "Completed", "₦27,800"]].map(([order, customer, status, total]) => <div className="order-row" key={order}><span className="order-id">{order}</span><span>{customer}</span><span><b className={`status ${status.toLowerCase()}`}>{status}</b></span><strong>{total}</strong></div>)}</div></section><section className="admin-panel" id="products"><div className="panel-heading"><div><span className="admin-eyebrow">Catalog</span><h2>Product management</h2></div><button className="panel-link">Manage products</button></div><p className="panel-copy">Add new products, update prices, manage stock and mark best sellers from one focused workspace. Product data is ready to connect to the managed database schema.</p></section></main></div>;
}
