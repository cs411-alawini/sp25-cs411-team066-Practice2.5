import React, { useEffect, useRef } from "react";
import L from "leaflet";
import markerIcon from "./MapIcons";
import "leaflet/dist/leaflet.css";

const MapView = ({ events, selectedEvent }) => {
	const mapRef = useRef(null); // Reference to the map container
	const mapInstanceRef = useRef(null); // Reference to the map instance
	const markersRef = useRef({}); // Reference to the markers

	const createPopupContent = (event) => {
		const date = new Date(event.event_time).toLocaleString("en-US");

		return `
			<div>
				<h3>${event.bird_name}</h3>
				<p><em>${event.bird_scientific_name}</em></p>
				<p><strong>Date:</strong> ${date}</p>
				<p><strong>Location:</strong> ${event.State}, ${event.Country}</p>
				<p><strong>Coordinates:</strong> ${event.latitude.toFixed(
					4
				)}, ${event.longitude.toFixed(4)}</p>
				${
					event.image_url
						? `<img src="${event.image_url}" alt="${event.bird_scientific_name}" style="width:100%;max-height:150px;object-fit:cover;margin-top:8px;">`
						: ""
				}
			</div>
		`;
	};

	useEffect(() => {
		// Initialize map (only once when component mounts)
		if (!mapInstanceRef.current && mapRef.current) {
			// TODO: Consider using a different map provider with API key for production
			// Options include: Google Maps, Mapbox, or commercial OpenStreetMap solutions
			const map = L.map(mapRef.current).setView([39.8283, -98.5795], 4); // USA center

			// TODO: Replace with paid tier for production to avoid usage limits
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution: "© OpenStreetMap contributors",
			}).addTo(map);
			mapInstanceRef.current = map;
		}

		if (!mapInstanceRef.current) return;

		// Clean up existing markers
		Object.values(markersRef.current).forEach((marker) => marker.remove());
		markersRef.current = {};

		// Add new markers
		events.forEach((event) => {
			if (!event.latitude || !event.longitude) return;

			const marker = L.marker([event.latitude, event.longitude], {
				icon: L.icon(markerIcon),
			})
				.addTo(mapInstanceRef.current)
				.bindPopup(createPopupContent(event), {
					maxWidth: 300,
					className: "bird-popup", // Class name for styling the popup
					autoPanPadding: [50, 50],
				});

			markersRef.current[event.event_id] = marker;
		});

		// Focus on selected event
		const marker = selectedEvent && markersRef.current[selectedEvent.event_id];
		if (marker) {
			mapInstanceRef.current.setView(
				[selectedEvent.latitude, selectedEvent.longitude],
				13
			);
			marker.openPopup();
		}

		// Cleanup function to remove map when component unmounts
		return () => {
			// This cleanup is crucial to prevent memory leaks
			if (mapInstanceRef.current) {
				mapInstanceRef.current.remove();
				mapInstanceRef.current = null;
			}
		};
	}, [events, selectedEvent]);

	return (
		<div className="map-container">
			<div ref={mapRef} style={{ height: "100%", width: "100%" }} />
		</div>
	);
};

export default MapView;
