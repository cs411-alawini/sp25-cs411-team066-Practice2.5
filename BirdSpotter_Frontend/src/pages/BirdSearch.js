import React, { useState, useEffect } from "react";
import "../styles/pages/BirdSearch.css";
const API_URL = process.env.REACT_APP_API_URL;

function BirdSearch() {
	const [searchTerm, setSearchTerm] = useState("");
	const [birds, setBirds] = useState([]);
	const [selectedBird, setSelectedBird] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isSearching, setIsSearching] = useState(false);

	// Initial load of first 10 birds
	useEffect(() => {
		const fetchInitialBirds = async () => {
			try {
				//http://localhost:8000/api/search?text=default
				console.log(`loading url ${"/api/search?text=default"}`);

				const response = await fetch(`/api/search?text=default`);

				console.log(`loaded ${response}`);

				const result = await response.json();

				if (result.status === "success") {
					setBirds(result.data);
					setSelectedBird(null);
				} else {
					setError(result.message);
				}
			} catch (error) {
				setError(
					"An error occurred while loading initial birds. Please try again."
				);
			} finally {
				setLoading(false);
			}
		};

		fetchInitialBirds();
	}, []);

	// Handle search
	const handleSearch = async (term) => {
		if (!term.trim()) {
			// If search term is empty, fetch default birds
			const response = await fetch(`/api/search?text=default`);
			const result = await response.json();

			if (result.status === "success") {
				setBirds(result.data);
				setSelectedBird(null);
			}
			return;
		}

		setIsSearching(true);
		setError(null);

		try {
			const url = `/api/search?text=${encodeURIComponent(term)}`;
			console.log("Searching birds from:", url);
			const response = await fetch(url, {
				method: "GET",
			});

			const result = await response.json();

			if (result.status === "success") {
				setBirds(result.data);
				// If it's a specific search (list length = 1), automatically select the bird
				if (result.data.length === 1) {
					setSelectedBird(result.data[0]);
				} else {
					setSelectedBird(null);
				}
			} else if (result.status === "error") {
				alert(`Bird not found: ${result.message}`);
			}
		} catch (error) {
			setError("An error occurred while searching. Please try again.");
		} finally {
			setIsSearching(false);
		}
	};

	// Handle bird selection
	const handleBirdSelect = (bird) => {
		setSelectedBird(bird === selectedBird ? null : bird);
	};

	return (
		<div className="bird-search-container">
			<div className="bird-search-header">
				<h1>Bird Encyclopedia</h1>
				<div className="search-box">
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						onKeyPress={(e) => {
							if (e.key === "Enter") {
								handleSearch(searchTerm);
							}
						}}
						placeholder="Search by scientific name..."
						className="search-input"
					/>
					<button
						className="search-button"
						onClick={() => handleSearch(searchTerm)}
					>
						Search
					</button>
					{isSearching && <div className="search-spinner"></div>}
				</div>
			</div>

			{loading ? (
				<div className="loading-state">Loading bird data...</div>
			) : error ? (
				<div className="error-message">{error}</div>
			) : (
				<div className="bird-encyclopedia">
					<div className="bird-list">
						<h2>Bird Species ({birds.length})</h2>
						{birds.length === 0 ? (
							<div className="no-results">No birds found.</div>
						) : (
							<ul>
								{birds.map((bird) => (
									<li
										key={bird.bird_scientific_name}
										onClick={() => handleBirdSelect(bird)}
										className={
											selectedBird?.bird_scientific_name ===
											bird.bird_scientific_name
												? "selected"
												: ""
										}
									>
										<h3>{bird.bird_common_name}</h3>
										<p className="scientific-name">
											{bird.bird_scientific_name}
										</p>
									</li>
								))}
							</ul>
						)}
					</div>

					<div className="bird-details">
						{selectedBird ? (
							<>
								<h2>{selectedBird.bird_common_name}</h2>
								<p className="scientific-name">
									{selectedBird.bird_scientific_name}
								</p>
								<div className="bird-description">
									<p>{selectedBird.bird_description}</p>
								</div>
							</>
						) : (
							<div className="no-selection">
								<p>Select a bird to view details</p>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default BirdSearch;
