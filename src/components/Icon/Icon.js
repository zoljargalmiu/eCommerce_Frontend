import React from "react";
import {
  Airplay,
  Users,
  LeftIndent,
  BookOpen,
  BookReader,
  Calculator,
  NewsPaper,
  Report,
  BookList,
  Archive,
  Rent,
  History,
  Tablet,
  UserAdd,
  Bus,
  Route,
  Settings,
  BriefCase,
  Food,
  Transaction,
  Pen,
  Enter,
} from "../../assets/icons/";

function Icon({ name = "", color }) {
  const getIcon = (name) => {
    switch (name) {
      case "airplay":
        return <Airplay className="oyunlag-icon" style={{ fill: color }} />;
      case "users":
        return <Users className="oyunlag-icon" style={{ fill: color }} />;
      case "bus":
        return <Bus className="oyunlag-icon" style={{ fill: color }} />;
      case "left-indent":
        return <LeftIndent className="oyunlag-icon" style={{ fill: color }} />;
      case "book-open":
        return <BookOpen className="oyunlag-icon" style={{ fill: color }} />;
      case "book-reader":
        return <BookReader className="oyunlag-icon" style={{ fill: color }} />;
      case "news-paper":
        return <NewsPaper className="oyunlag-icon" style={{ fill: color }} />;
      case "calculator":
        return <Calculator className="oyunlag-icon" style={{ fill: color }} />;
      case "report":
        return <Report className="oyunlag-icon" style={{ fill: color }} />;
      case "book-list":
        return <BookList className="oyunlag-icon" style={{ fill: color }} />;
      case "archive":
        return <Archive className="oyunlag-icon" style={{ fill: color }} />;
      case "rent":
        return <Rent className="oyunlag-icon" style={{ fill: color }} />;
      case "history":
        return <History className="oyunlag-icon" style={{ fill: color }} />;
      case "tablet":
        return <Tablet className="oyunlag-icon" style={{ fill: color }} />;
      case "user-add":
        return <UserAdd className="oyunlag-icon" style={{ fill: color }} />;
      case "route":
        return <Route className="oyunlag-icon" style={{ fill: color }} />;
      case "settings":
        return <Settings className="oyunlag-icon" style={{ fill: color }} />;
      case "briefcase":
        return <BriefCase className="oyunlag-icon" style={{ fill: color }} />;
      case "food":
        return <Food className="oyunlag-icon" style={{ fill: color }} />;
      case "pen":
        return <Pen className="oyunlag-icon" style={{ fill: color }} />;
      case "enter":
        return <Enter className="oyunlag-icon" style={{ fill: color }} />;
      case "transaction":
        return <Transaction className="oyunlag-icon" style={{ fill: color }} />;
      default:
        return <Airplay className="oyunlag-icon" style={{ fill: color }} />;
    }
  };

  return getIcon(name);
}

export default Icon;
