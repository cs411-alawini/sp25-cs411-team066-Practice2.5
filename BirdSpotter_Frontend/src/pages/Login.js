import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateUser } from "../utils/dummyData";
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
			// TODO: Replace with actual API call to backend
			// const response = await fetch('/api/auth/login', {
			//   method: 'POST',
			//   headers: {
			//     'Content-Type': 'application/json',
			//   },
			//   body: JSON.stringify({
			//     username: formData.username,
			//     password: formData.password,
			//   }),
			// });
			//
			// if (!response.ok) {
			//   const errorData = await response.json();
			//   throw new Error(errorData.message || 'Login failed');
			// }
			//
			// const user = await response.json();

			// Using mock authentication for development
			const user = authenticateUser(formData.username, formData.password);

			setUser(user); // Save user info in context
			navigate("/home");
		} catch (err) {
			setError(err.message || "Login failed. Please try again.");
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
						<li>Username: john_doe / Password: password123</li>
						<li>Username: jane_smith / Password: password456</li>
						<li>Username: admin / Password: admin123</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default Login;
