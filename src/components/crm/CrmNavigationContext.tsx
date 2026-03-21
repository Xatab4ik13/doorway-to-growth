import { createContext, useContext } from "react";

interface CrmNavigationContextType {
  navigate: (section: string) => void;
}

const CrmNavigationContext = createContext<CrmNavigationContextType>({ navigate: () => {} });

export const CrmNavigationProvider = CrmNavigationContext.Provider;
export const useCrmNavigation = () => useContext(CrmNavigationContext);
