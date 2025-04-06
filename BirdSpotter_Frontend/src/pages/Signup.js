import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
	const [form, setForm] = useState({ username: "", name: "", password: "" });
	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Add actual signup logic here
		alert(
			`Registration successful!\nUsername: ${form.username}\nName: ${form.name}`
		);
		navigate("/login");
	};

	return (
		<div className="card">
			<form onSubmit={handleSubmit} className="text-center">
				<h2>Sign Up</h2>
				<div className="form-group">
					<label htmlFor="username">Username</label>
					<input
						type="text"
						id="username"
						name="username"
						placeholder="Enter your username"
						value={form.username}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="name">Name</label>
					<input
						type="text"
						id="name"
						name="name"
						placeholder="Enter your name"
						value={form.name}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						placeholder="Enter your password"
						value={form.password}
						onChange={handleChange}
						required
					/>
				</div>
				<button type="submit" className="btn">
					Sign Up
				</button>
				<div style={{ marginTop: "1rem" }}>
					Already have an account?{" "}
					<Link to="/login" className="btn-link">
						Login now
					</Link>
				</div>
			</form>
		</div>
	);
}

export default Signup;
