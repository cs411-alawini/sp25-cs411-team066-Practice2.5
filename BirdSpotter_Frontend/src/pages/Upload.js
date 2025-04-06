import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usStates } from "../utils/dummyData";
import "../styles/pages/Upload.css";
const API_URL = process.env.REACT_APP_API_URL;

function Upload() {
	const navigate = useNavigate();
	const fileInputRef = useRef(null);

	const [formData, setFormData] = useState({
		bird_scientific_name: "",
		latitude: "",
		longitude: "",
		Country: "United States",
		State: "",
		event_time: new Date().toISOString(),
	});

	const [birdImage, setBirdImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [imageError, setImageError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(0);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const validateCoordinates = (lat, lng) => {
		if (isNaN(lat) || isNaN(lng)) {
			throw new Error("Coordinates must be numbers");
		}
		if (lat < -90 || lat > 90) {
			throw new Error("Latitude must be between -90 and 90 degrees");
		}
		if (lng < -180 || lng > 180) {
			throw new Error("Longitude must be between -180 and 180 degrees");
		}
		if (
			lat.toString().split(".")[1]?.length > 6 ||
			lng.toString().split(".")[1]?.length > 6
		) {
			throw new Error("Coordinates can have at most 6 decimal places");
		}
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		setImageError(null);

		if (!file) {
			setBirdImage(null);
			setImagePreview(null);
			return;
		}

		// Check file type
		if (!file.type.match("image.*")) {
			setImageError("Please upload an image file (JPEG, PNG, etc.)");
			return;
		}

		// Check file size (5MB limit)
		const fileSize = file.size / 1024 / 1024; // size in MB
		if (fileSize > 5) {
			setImageError("Image size must be less than 5MB");
			return;
		}

		// Create image preview
		const reader = new FileReader();
		reader.onload = (e) => {
			setImagePreview(e.target.result);
		};
		reader.readAsDataURL(file);

		setBirdImage(file);
	};

	const handleRemoveImage = () => {
		setBirdImage(null);
		setImagePreview(null);
		setImageError(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const simulateImageUpload = async (image) => {
		// TODO: Replace with actual image upload to Google Cloud Storage
		// const formData = new FormData();
		// formData.append('image', image);
		//
		// return fetch('/api/upload/image', {
		//   method: 'POST',
		//   body: formData,
		//   onUploadProgress: (progressEvent) => {
		//     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
		//     setUploadProgress(percentCompleted);
		//   }
		// }).then(response => response.json())
		//   .then(data => data.imageUrl);

		// This function simulates uploading an image to Google Cloud
		return new Promise((resolve) => {
			const totalSteps = 10;
			let currentStep = 0;

			const interval = setInterval(() => {
				currentStep++;
				setUploadProgress(Math.round((currentStep / totalSteps) * 100));

				if (currentStep >= totalSteps) {
					clearInterval(interval);
					// Return a mock image URL
					resolve(
						`https://storage.googleapis.com/mock-bucket/bird-${Date.now()}.jpg`
					);
				}
			}, 200);
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);
		setError(null);
		setUploadProgress(0);

		try {
			const lat = parseFloat(formData.latitude);
			const lng = parseFloat(formData.longitude);
			validateCoordinates(lat, lng);

			if (!formData.bird_scientific_name) {
				throw new Error("Please enter the bird scientific name");
			}

			if (!formData.State) {
				throw new Error("Please select a state");
			}

			if (!birdImage) {
				throw new Error("Please upload a bird image");
			}

			// 创建FormData对象用于上传图片
			const formDataToSend = new FormData();
			formDataToSend.append("bird_photo", birdImage);
			formDataToSend.append("scientific_name", formData.bird_scientific_name);
			formDataToSend.append("latitude", lat);
			formDataToSend.append("longitude", lng);
			formDataToSend.append("country", formData.Country);
			formDataToSend.append("state", formData.State);
			formDataToSend.append("user_id", "1"); // TODO: 从用户上下文获取实际用户ID

			// 上传数据到API
			const response = await fetch(`${API_URL}/events/create`, {
				method: "POST",
				body: formDataToSend,
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Upload failed");
			}

			const newEvent = await response.json();
			console.log("Upload successful:", newEvent);
			navigate("/home");
		} catch (err) {
			console.error("Upload error:", err);
			setError(err.message || "Upload failed");
		} finally {
			setLoading(false);
			setUploadProgress(0);
		}
	};

	return (
		<div className="upload-container">
			<h1>Upload Bird Sighting</h1>
			{error && <div className="error-message">{error}</div>}
			<form onSubmit={handleSubmit} className="upload-form">
				<div className="form-group">
					<label htmlFor="bird_scientific_name">Bird Scientific Name</label>
					<input
						type="text"
						id="bird_scientific_name"
						name="bird_scientific_name"
						value={formData.bird_scientific_name}
						onChange={handleInputChange}
						required
						className="form-control"
						placeholder="Enter bird scientific name (e.g., Corvus brachyrhynchos)"
						maxLength={150}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="bird_image">Bird Image</label>
					<div className="image-upload-container">
						<input
							type="file"
							id="bird_image"
							name="bird_image"
							accept="image/*"
							onChange={handleImageChange}
							className="form-control file-input"
							ref={fileInputRef}
						/>
						<div className="image-upload-help">
							Maximum file size: 5MB. Accepted formats: JPEG, PNG, GIF.
						</div>

						{imageError && <div className="image-error">{imageError}</div>}

						{imagePreview && (
							<div className="image-preview-container">
								<img
									src={imagePreview}
									alt="Bird preview"
									className="image-preview"
								/>
								<button
									type="button"
									className="remove-image-btn"
									onClick={handleRemoveImage}
								>
									Remove Image
								</button>
							</div>
						)}
					</div>
				</div>

				<div className="form-group">
					<label htmlFor="latitude">Latitude</label>
					<input
						type="number"
						id="latitude"
						name="latitude"
						value={formData.latitude}
						onChange={handleInputChange}
						step="0.000001"
						required
						className="form-control"
						placeholder="Enter latitude (-90 to 90)"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="longitude">Longitude</label>
					<input
						type="number"
						id="longitude"
						name="longitude"
						value={formData.longitude}
						onChange={handleInputChange}
						step="0.000001"
						required
						className="form-control"
						placeholder="Enter longitude (-180 to 180)"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="Country">Country</label>
					<select
						id="Country"
						name="Country"
						value={formData.Country}
						onChange={handleInputChange}
						required
						className="form-control"
						disabled
					>
						<option value="United States">United States</option>
					</select>
				</div>

				<div className="form-group">
					<label htmlFor="State">State</label>
					<select
						id="State"
						name="State"
						value={formData.State}
						onChange={handleInputChange}
						required
						className="form-control"
					>
						<option value="">Select a state</option>
						{usStates.map((state) => (
							<option key={state.code} value={state.name}>
								{state.name}
							</option>
						))}
					</select>
				</div>

				{loading && uploadProgress > 0 && (
					<div className="upload-progress">
						<div className="progress-bar">
							<div
								className="progress-fill"
								style={{ width: `${uploadProgress}%` }}
							></div>
						</div>
						<div className="progress-text">
							Uploading image: {uploadProgress}%
						</div>
					</div>
				)}

				<button type="submit" className="submit-button" disabled={loading}>
					{loading ? "Uploading..." : "Upload Sighting"}
				</button>
			</form>
		</div>
	);
}

export default Upload;
