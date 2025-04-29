import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import "../styles/pages/Login.css";

function Login() {
	const navigate = useNavigate();
	const { setUser } = useContext(UserContext);
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/v1/login/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: formData.username,
					password: formData.password,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Login failed");
			}

			const userData = await response.json();
			console.log("Login API Response:", userData);
			console.log("User ID from API:", userData.user.user_id);
			console.log("Username from API:", userData.user.username);

			setUser({
				user_id: userData.user.user_id,
				username: userData.user.username,
			});
			console.log("User context after setUser:", {
				user_id: userData.user.user_id,
				username: userData.user.username,
			});

			navigate("/home");
		} catch (err) {
			setError(err.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="login-container">
			<div className="login-card">
				<h1>Login</h1>
				{error && <div className="error-message">{error}</div>}
				<form onSubmit={handleSubmit} className="login-form">
					<div className="form-group">
						<label htmlFor="username">Username</label>
						<input
							type="text"
							id="username"
							name="username"
							value={formData.username}
							onChange={handleInputChange}
							required
							className="form-control"
							placeholder="Enter your username"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleInputChange}
							required
							className="form-control"
							placeholder="Enter your password"
						/>
					</div>
					<button type="submit" className="submit-button" disabled={loading}>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>
				<div className="demo-accounts">
					<p className="demo-title">Demo Accounts:</p>
					<ul>
						<li>Username: Maria Ingram / Password: hZTwmjV6DFDwEm</li>
						<li>Username: Jacob Johnson / Password: 9LwiFfP2oXF</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default Login;
