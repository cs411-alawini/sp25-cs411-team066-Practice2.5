import React, { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import BirdSearch from "./pages/BirdSearch";
import Dashboard from "./pages/Dashboard";
import UserContext from "./UserContext";
import "./styles/global.css";

function App() {
	const [user, setUser] = useState(() => {
		// 从localStorage获取保存的用户信息
		const savedUser = localStorage.getItem("user");
		return savedUser ? JSON.parse(savedUser) : null;
	});

	// 当用户信息改变时，保存到localStorage
	useEffect(() => {
		if (user) {
			localStorage.setItem("user", JSON.stringify(user));
		} else {
			localStorage.removeItem("user");
		}
	}, [user]);

	const isAuthenticated = Boolean(user);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			<Router>
				<div className="app-container">
					<Navigation isAuthenticated={isAuthenticated} />

					<main className="main-content">
						<Routes>
							{/* Public routes */}
							<Route
								path="/"
								element={
									isAuthenticated ? (
										<Navigate to="/home" replace />
									) : (
										<Navigate to="/login" replace />
									)
								}
							/>
							<Route
								path="/login"
								element={
									isAuthenticated ? <Navigate to="/home" replace /> : <Login />
								}
							/>
							<Route
								path="/signup"
								element={
									isAuthenticated ? <Navigate to="/home" replace /> : <Signup />
								}
							/>

							{/* Protected routes */}
							<Route
								path="/home"
								element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
							/>
							<Route
								path="/upload"
								element={
									isAuthenticated ? <Upload /> : <Navigate to="/login" />
								}
							/>
							<Route
								path="/search"
								element={
									isAuthenticated ? <BirdSearch /> : <Navigate to="/login" />
								}
							/>
							<Route
								path="/dashboard"
								element={
									isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
								}
							/>

							{/* 404 route */}
							<Route path="*" element={<Navigate to="/" replace />} />
						</Routes>
					</main>
				</div>
			</Router>
		</UserContext.Provider>
	);
}

export default App;
