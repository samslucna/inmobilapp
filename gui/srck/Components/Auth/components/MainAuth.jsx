import React, { Fragment, useContext, useState } from "react";
import Auth from "./Auth";
import UserProfile from "../../UserProfile";

const MainAuth = () => {
  const [selectedPageMain, setSelectedPageMain] = useState('');

  const handlerPageMain = () => {
    switch (selectedPageMain) {
      case "login":
        return (<Auth setSelectedPageMain={setSelectedPageMain} />);

      case "userprofile":
        return (<UserProfile setSelectedPageMain={setSelectedPageMain} />);

      default:
        return (<Auth setSelectedPageMain={setSelectedPageMain} />);
    }
  };

  return <Fragment>{handlerPageMain()}</Fragment>;
};

export default MainAuth;
