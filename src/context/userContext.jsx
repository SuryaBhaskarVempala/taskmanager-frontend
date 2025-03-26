import { createContext, useState } from "react";

export const userContext = createContext(); 


export function UserContextProvider({ children }) {
    
    const [user,setUser] = useState(null);

    const usercontext = {
       user,setUser
    };

    return (
        <div className="App">
        <userContext.Provider value={usercontext}>
            {children}
        </userContext.Provider>
        </div>
    );
}
