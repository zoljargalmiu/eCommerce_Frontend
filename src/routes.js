import Users from "./pages/Users/Users";
import Products from "./pages/Products/Products";
import ShoppingCard from "./pages/ShoppingCard/ShoppingCard";
import AddProducts from "./pages/AddProducts/AddProducts";

export const adminRoutes = [
  {
    path: "/",
    exact: true,
    component: Users,
    showHeader: true,
    icon: "users",
  },
  {
    path: "/products",
    component: Products,
    showHeader: true,
    icon: "users",
  },
  // {
  //   path: "/products/:productsID",
  //   component: Courts,
  //   showHeader: true,
  //   icon: "book-open",
  // },
];

export const sellerRoutes = [
  {
    path: "/",
    exact: true,
    component: AddProducts,
    showHeader: true,
    icon: "airplay",
  },
];

export const buyerRoutes = [
  {
    path: "/",
    exact: true,
    component: ShoppingCard,
    showHeader: true,
    icon: "airplay",
  },
];
