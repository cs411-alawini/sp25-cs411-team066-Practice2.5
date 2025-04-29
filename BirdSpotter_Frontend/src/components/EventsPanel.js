// src/components/EventsPanel.js
import React from "react";

/**
 * EventsPanel displays a list of bird sighting events with search functionality
 *
 * @param {Array} events - List of bird sighting events to display
 * @param {Object} selectedEvent - Currently selected event
 * @param {Function} onEventSelect - Callback when an event is selected
 * @param {String} searchTerm - Current search term
 * @param {Function} onSearchChange - Callback when search term changes
 * @param {Function} onSearchSubmit - Callback when search is submitted
 * @param {Boolean} isSearching - Whether a search is currently in progress
 * @param {Number} currentPage - Current page number
 * @param {Number} totalItems - Total number of items
 * @param {Number} itemsPerPage - Number of items per page
 * @param {Function} onPageChange - Callback when page changes
 * @param {Number} totalPages - Total number of pages
 * @param {Boolean} loading - Whether the data is currently being loaded
 */
const EventsPanel = ({
	events,
	selectedEvent,
	onEventSelect,
	searchTerm,
	onSearchChange,
	onSearchSubmit,
	isSearching,
	currentPage,
	totalItems,
	itemsPerPage = 10,
	onPageChange,
	totalPages,
	loading,
}) => {
	// Format date for display
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	// 生成页码按钮
	const renderPageButtons = () => {
		const buttons = [];
		const maxVisiblePages = 5;
		let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
		let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

		if (endPage - startPage + 1 < maxVisiblePages) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1);
		}

		// 添加第一页按钮
		if (startPage > 1) {
			buttons.push(
				<button
					key="first"
					className="page-button"
					onClick={() => onPageChange(1)}
				>
					1
				</button>
			);
			if (startPage > 2) {
				buttons.push(<span key="ellipsis1">...</span>);
			}
		}

		// 添加页码按钮
		for (let i = startPage; i <= endPage; i++) {
			buttons.push(
				<button
					key={i}
					className={`page-button ${currentPage === i ? "active" : ""}`}
					onClick={() => onPageChange(i)}
				>
					{i}
				</button>
			);
		}

		// 添加最后一页按钮
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				buttons.push(<span key="ellipsis2">...</span>);
			}
			buttons.push(
				<button
					key="last"
					className="page-button"
					onClick={() => onPageChange(totalPages)}
				>
					{totalPages}
				</button>
			);
		}

		return buttons;
	};

	return (
		<div className="events-panel">
			<h2>Bird Sighting Events</h2>

			<div className="search-container">
				<div className="search-box">
					<input
						type="text"
						className="search-input"
						placeholder="Search by scientific name..."
						value={searchTerm}
						onChange={(e) => onSearchChange(e.target.value)}
						onKeyPress={(e) => {
							if (e.key === "Enter") {
								onSearchSubmit(searchTerm);
							}
						}}
					/>
					<button
						className="search-button"
						onClick={() => onSearchSubmit(searchTerm)}
					>
						Search
					</button>
					{isSearching && <div className="search-spinner"></div>}
				</div>
			</div>

			<div className="event-count">
				Showing {events.length} of {totalItems} Records
				{searchTerm && ` matching "${searchTerm}"`}
			</div>

			<div className="table-container">
				{loading ? (
					<div className="loading">Loading...</div>
				) : events.length > 0 ? (
					<>
						<table className="events-table">
							<thead>
								<tr>
									<th>Date</th>
									<th>Bird</th>
									<th>Location</th>
								</tr>
							</thead>
							<tbody>
								{events.map((event) => (
									<tr
										key={event.event_id}
										onClick={() => onEventSelect(event)}
										className={
											selectedEvent?.event_id === event.event_id
												? "selected"
												: ""
										}
									>
										<td>{formatDate(event.event_time)}</td>
										<td>
											<div className="bird-name">{event.bird_name}</div>
											<div className="scientific-name">
												{event.bird_scientific_name}
											</div>
										</td>
										<td>{`${event.state}, ${event.country}`}</td>
									</tr>
								))}
							</tbody>
						</table>
						<div className="pagination">
							<button
								className="page-button"
								onClick={() => onPageChange(currentPage - 1)}
								disabled={currentPage === 1}
							>
								Previous
							</button>
							{renderPageButtons()}
							<button
								className="page-button"
								onClick={() => onPageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
							>
								Next
							</button>
						</div>
					</>
				) : (
					<div className="no-results">No matching records found</div>
				)}
			</div>
		</div>
	);
};

export default EventsPanel;
