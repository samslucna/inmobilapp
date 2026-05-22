import React, { createContext, useState } from "react";

//Pages

import Home from "../Components/UserProfile/components/Home";
import Property from "../Components/Property";
import Config from "../Components/Config";
import Buyer from "../Components/Buyer";
import Seller from "../Components/Seller";
import Agent from "../Components/Agent";
import Ticket from "../Components/Ticket";
import Contract from "../Components/Contract";
import PropertyProvider from "./PropertyContext ";
import BuyerProvider from "./BuyerContext";
import SellerProvider from "./SellerContext";
import AgentProvider from "./AgentContext";
import ContractProvider from "./ContractContext";
import TicketProvider from "./TicketContext";
import ConfigProvider from "./ConfigContext";
//Forms

//Components

//Providers

export const RenderContext = createContext();

const RenderProvider = (props) => {
  const [selectedPage, setSelectedPage] = useState(null);

  const handlerPage = () => {
    switch (selectedPage) {
      case "cmhome":
        return <Home setSelectedPage={setSelectedPage} />;

      case "cmticket":
        return (
          <TicketProvider>
            <Ticket key={'tickets'} setSelectedPage={setSelectedPage} />
          </TicketProvider>
        );

      case "cmproperty":
        return (
          <PropertyProvider>
            <Property setSelectedPage={setSelectedPage} />
          </PropertyProvider>
        );

            case "cmconfig":
        return (
          <ConfigProvider>
            <Config key={'confg'} setSelectedPage={setSelectedPage} />
          </ConfigProvider>
        );

      case "cmbuyer":
        return (<BuyerProvider>
          <Buyer setSelectedPage={setSelectedPage} />
        </BuyerProvider>);
      case "cmseller":
        return (
          <SellerProvider>
            <Seller setSelectedPage={setSelectedPage} />
          </SellerProvider>
        );
      case "cmagent":
        return (
          <AgentProvider>
            <Agent setSelectedPage={setSelectedPage} />
          </AgentProvider>
        );
      case "cmcontract":
        return (
          <ContractProvider>
             <TicketProvider>
            <Contract setSelectedPage={setSelectedPage} />
            </TicketProvider>
          </ContractProvider>
        );

      default:
        return <Home setSelectedPage={setSelectedPage} />;
    }
  };

  return (
    <RenderContext.Provider
      value={{
        handlerPage,
        selectedPage,
        setSelectedPage,
      }}
    >
      {props.children}
    </RenderContext.Provider>
  );
};

export default RenderProvider;
