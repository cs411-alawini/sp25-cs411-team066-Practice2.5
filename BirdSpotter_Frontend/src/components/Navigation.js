import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserContext from "../UserContext";

const Navigation = ({ isAuthenticated }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, setUser } = useContext(UserContext);

	const handleLogout = () => {
		setUser(null);
		navigate("/login");
	};

	if (
		!isAuthenticated &&
		(location.pathname === "/" || location.pathname === "/login")
	) {
		return null;
	}

	return (
		<nav className="nav-container">
			<div className="nav-brand">
				<Link to="/home">
					{isAuthenticated && user?.name ? (
						<h1 className="welcome-text">Welcome, {user.name}</h1>
					) : (
						<h1>Bird Sighting Tracker</h1>
					)}
				</Link>
			</div>
			<div className="nav-links">
				{!isAuthenticated ? (
					<>
						<Link to="/login">Login</Link>
						<Link to="/signup" className="btn">
							Sign Up
						</Link>
					</>
				) : (
					<>
						<Link to="/home">Home</Link>
						<Link to="/search">Search</Link>
						<Link to="/upload">Upload</Link>
						<button className="nav-link-button" onClick={handleLogout}>
							Logout
						</button>
					</>
				)}
			</div>
		</nav>
	);
};

export default Navigation;
