import React, { useState, useEffect, useCallback } from "react";
import EventsPanel from "../components/EventsPanel";
import MapView from "../components/MapView";
import "../styles/pages/Home.css";

// 添加环境变量
const API_URL = "/api";

function Home() {
	const [events, setEvents] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [isSearching, setIsSearching] = useState(false);

	// 分页状态
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		totalItems: 0,
		hasNext: false,
	});

	const itemsPerPage = 10;

	// 获取分页数据
	const fetchPagedEvents = useCallback(
		async (page = 1) => {
			console.log("Fetching page:", page);
			try {
				setLoading(true);
				// 确保 page 是数字类型
				const pageNum = parseInt(page, 10);
				const response = await fetch(
					`${API_URL}/events/page?page=${pageNum}&limit=${itemsPerPage}`
				);

				if (!response.ok) {
					throw new Error(`Failed to fetch events: ${response.status}`);
				}

				const result = await response.json();
				if (result.status !== "success") {
					throw new Error("API returned unsuccessful status");
				}

				const { data } = result;
				console.log("Page data:", {
					events: data.events.length,
					currentPage: data.pagination.current_page,
					totalPages: data.pagination.total_pages,
					totalItems: data.pagination.total_items,
					hasNext: data.pagination.has_next,
					requestPage: pageNum,
				});

				// 更新分页信息
				setPagination({
					currentPage: data.pagination.current_page,
					totalPages: data.pagination.total_pages,
					totalItems: data.pagination.total_items,
					hasNext: data.pagination.has_next,
				});

				// 直接设置新数据
				setEvents(data.events);
				setFilteredEvents(data.events);

				setError(null);
			} catch (err) {
				console.error("Fetch error:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		},
		[itemsPerPage]
	);

	// 搜索特定鸟类的事件
	const handleSearch = useCallback(
		async (term) => {
			console.log("Searching:", term);

			if (!term.trim()) {
				console.log("Empty search, resetting to page 1");
				fetchPagedEvents(1);
				return;
			}

			setIsSearching(true);
			try {
				const response = await fetch(
					`${API_URL}/events?search=${encodeURIComponent(term)}`
				);

				if (!response.ok) {
					throw new Error(`Search failed with status: ${response.status}`);
				}

				const result = await response.json();
				console.log("Search response:", result);

				if (!result || result.status !== "success") {
					throw new Error(
						"API returned unsuccessful status or invalid response"
					);
				}

				if (!result.data || !Array.isArray(result.data)) {
					throw new Error("Invalid data format in response");
				}

				console.log("Search results:", {
					events: result.data.length,
					currentPage: 1,
					totalItems: result.data.length,
				});

				// 更新事件数据
				setEvents(result.data);
				setFilteredEvents(result.data);

				// 重置分页信息
				setPagination({
					currentPage: 1,
					totalPages: 1,
					totalItems: result.data.length,
					hasNext: false,
				});

				// 重置选中的事件
				setSelectedEvent(null);

				setError(null);
			} catch (err) {
				console.error("Search error:", err);
				setError("Search failed: " + err.message);
				// 清空搜索结果
				setEvents([]);
				setFilteredEvents([]);
				setPagination({
					currentPage: 1,
					totalPages: 1,
					totalItems: 0,
					hasNext: false,
				});
			} finally {
				setIsSearching(false);
			}
		},
		[fetchPagedEvents]
	);

	// 处理搜索输入变化
	const handleSearchChange = useCallback((term) => {
		setSearchTerm(term);
	}, []);

	// 处理页码变化
	const handlePageChange = useCallback(
		(newPage) => {
			console.log("Page change:", newPage);
			// 确保新页码在有效范围内
			if (newPage >= 1 && newPage <= pagination.totalPages) {
				fetchPagedEvents(newPage);
			}
		},
		[fetchPagedEvents, pagination.totalPages]
	);

	// 初始加载第一页数据
	useEffect(() => {
		fetchPagedEvents(1);
	}, [fetchPagedEvents]);

	if (loading && !events.length) {
		return <div className="loading-state">Loading events...</div>;
	}

	if (error && !events.length) {
		return <div className="error-state">{error}</div>;
	}

	return (
		<div className="home-container">
			<EventsPanel
				events={filteredEvents}
				selectedEvent={selectedEvent}
				onEventSelect={setSelectedEvent}
				searchTerm={searchTerm}
				onSearchChange={handleSearchChange}
				onSearchSubmit={handleSearch}
				isSearching={isSearching}
				currentPage={pagination.currentPage}
				totalItems={pagination.totalItems}
				itemsPerPage={itemsPerPage}
				onPageChange={handlePageChange}
				totalPages={pagination.totalPages}
				loading={loading}
			/>
			<MapView events={filteredEvents} selectedEvent={selectedEvent} />
		</div>
	);
}

export default Home;
