import Users from "./pages/Users/Users";
import Clubs from "./pages/Clubs/Clubs";
import Courts from "./pages/Courts/Courts";
import Calendar from "./pages/Calendar/Calendar";
import MyClubs from "./pages/MyClubs/MyClubs";
import Players from "./pages/Players/Players";
import Products from "./pages/Products/Products";

export const adminRoutes = [
  {
    path: "/",
    exact: true,
    component: Clubs,
    showHeader: true,
    icon: "airplay",
  },
  {
    path: "/users",
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
  {
    path: "/products/:productsID",
    component: Courts,
    showHeader: true,
    icon: "book-open",
  },
];

export const ownerRoutes = [
  {
    path: "/",
    exact: true,
    component: MyClubs,
    showHeader: true,
    icon: "airplay",
  },
  {
    path: "/players",
    component: Players,
    showHeader: true,
    icon: "owners",
  },
  {
    path: "/club/:clubID",
    component: Courts,
    showHeader: true,
    icon: "book-open",
  },
  {
    path: "/calendar/:courtID",
    component: Calendar,
    showHeader: true,
    icon: "tablet",
  },
];

export const playerRoutes = [
  {
    path: "/",
    exact: true,
    component: MyClubs,
    showHeader: true,
    icon: "airplay",
  },
  {
    path: "/club/:clubID",
    component: Courts,
    showHeader: true,
    icon: "book-open",
  },
  {
    path: "/calendar/:courtID",
    component: Calendar,
    showHeader: true,
    icon: "tablet",
  },
];
