import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import "../styles/pages/Dashboard.css";

function Dashboard() {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		console.log("Dashboard: Current user context:", user);

		const fetchUserEvents = async () => {
			try {
				if (!user || !user.user_id) {
					console.log("Dashboard: No user or user_id found in context");
					throw new Error("User session expired. Please login again.");
				}

				console.log("Dashboard: Fetching events for user_id:", user.user_id);
				const response = await fetch(
					`/api/user_events?user_id=${user.user_id}`
				);

				console.log("Dashboard: API Response status:", response.status);
				if (!response.ok) {
					throw new Error("Failed to fetch user events");
				}

				const data = await response.json();
				console.log("Dashboard: API Response data:", data);

				if (data.status === "error") {
					throw new Error(data.message || "Failed to fetch user events");
				}
				setEvents(data.data || []); // 注意这里改成了 data.data
			} catch (err) {
				console.error("Dashboard: Error details:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchUserEvents();
	}, [user]);

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const handleDeleteEvent = async (eventId) => {
		try {
			const response = await fetch(`/api/events/${eventId}`, {
				method: "DELETE",
			});

			const data = await response.json();
			if (data.status === "success") {
				// 从列表中移除已删除的事件
				setEvents(events.filter((event) => event.event_id !== eventId));
			} else {
				throw new Error(data.message || "Failed to delete event");
			}
		} catch (err) {
			console.error("Error deleting event:", err);
			alert("Failed to delete event: " + err.message);
		}
	};

	if (loading) {
		return (
			<div className="dashboard-container">
				<div className="loading-state">Loading your sightings...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="dashboard-container">
				<div className="error-state">{error}</div>
			</div>
		);
	}

	return (
		<div className="dashboard-container">
			<div className="dashboard-header">
				<h1>My Bird Sightings</h1>
			</div>

			{events.length === 0 ? (
				<div className="no-events">
					<p>You haven't uploaded any bird sightings yet.</p>
				</div>
			) : (
				<div className="events-grid">
					{events.map((event) => (
						<div key={event.event_id} className="event-card">
							<div className="event-image">
								<img
									src={event.image_url}
									alt={event.bird_scientific_name}
									onError={(e) => {
										e.target.src = "/placeholder-bird.jpg";
									}}
								/>
							</div>
							<div className="event-details">
								<h3>{event.bird_scientific_name}</h3>
								<p className="event-location">
									📍 {event.State}, {event.Country}
								</p>
								<p className="event-time">🕒 {formatDate(event.event_time)}</p>
								<div className="event-coordinates">
									<span>Lat: {event.latitude.toFixed(6)}</span>
									<span>Long: {event.longitude.toFixed(6)}</span>
								</div>
								<div className="event-actions">
									<button
										className="delete-button"
										onClick={() => {
											if (
												window.confirm(
													"Are you sure you want to delete this sighting?"
												)
											) {
												handleDeleteEvent(event.event_id);
											}
										}}
									>
										Delete Sighting
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default Dashboard;
