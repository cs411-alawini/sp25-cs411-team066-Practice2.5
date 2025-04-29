import React, { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const savedUser = localStorage.getItem("user");
		return savedUser ? JSON.parse(savedUser) : null;
	});

	useEffect(() => {
		console.log("User state changed:", user);
		if (user) {
			localStorage.setItem("user", JSON.stringify(user));
		} else {
			localStorage.removeItem("user");
		}
	}, [user]);

	const setUserWithLog = (userData) => {
		console.log("Setting user state to:", userData);
		setUser(userData);
	};

	return (
		<UserContext.Provider value={{ user, setUser: setUserWithLog }}>
			{children}
		</UserContext.Provider>
	);
};

export default UserContext;
