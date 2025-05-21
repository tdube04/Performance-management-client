import { createContext, useContext, useState } from "react";

const StateContext = createContext({
  currentUser: null,
  token: null,
  notification: null,
  userType: null,
  userName: null,
  profileData: null,
  setUser: () => {},
  setToken: () => {},
  setNotification: () => {},
  setUserType: () => {},
  setUserName: () => {},
  setProfileData: () => {},
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  // const [token, _setToken] = useState(123);
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  const [userType, _setUserType] = useState("");

  const [userName, _setUserName] = useState("");

  const [profileData, _setProfileData] = useState(null);

  const [notification, _setNotification] = useState("");

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };
  const setProfileData = (profileData) => {
    _setProfileData(profileData);
  };

  const setUserType = (userType) => {
    _setUserType(userType);
  };

  const setUserName = (userName) => {
    _setUserName(userName);
  };

  const setNotification = (message) => {
    _setNotification(message);

    setTimeout(() => {
      _setNotification("");
    }, 5000);
  };

  return (
    <StateContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        notification,
        setNotification,
        userType,
        setUserType,
        userName,
        setUserName,
        profileData,
        setProfileData
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
