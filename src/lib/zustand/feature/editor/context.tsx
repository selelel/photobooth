import { createContext } from "react";

export const Context = createContext(undefined)

export function Provider ({children}: any) {
    <Context.Provider value={undefined}>
        {children}
    </Context.Provider>
}
    