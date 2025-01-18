import { createContext, useState } from "react";

interface Auth {
  token: string | null;
  setToken: (token: string) => void;
}

const AuthContext = createContext<Auth>({
  token: null,
  setToken: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const storedToken = localStorage.getItem("token");
  const [token, setToken] = useState<string | null>(storedToken);


  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };