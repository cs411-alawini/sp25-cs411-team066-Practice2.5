// Mock data for development and testing
export const mockEvents = [
	{
		event_id: 1,
		user_id: 101,
		event_time: "2024-04-15T10:30:00",
		longitude: -122.4194,
		latitude: 37.7749,
		Country: "United States",
		State: "California",
		bird_name: "American Crow",
		bird_scientific_name: "Corvus brachyrhynchos",
		image_url: "https://storage.googleapis.com/mock-bucket/american-crow.jpg",
	},
	{
		event_id: 2,
		user_id: 102,
		event_time: "2024-04-14T15:45:00",
		longitude: -74.006,
		latitude: 40.7128,
		Country: "United States",
		State: "New York",
		bird_name: "Rock Pigeon",
		bird_scientific_name: "Columba livia",
		image_url: "https://storage.googleapis.com/mock-bucket/rock-pigeon.jpg",
	},
	{
		event_id: 3,
		user_id: 103,
		event_time: "2024-04-13T12:30:00",
		longitude: -118.2437,
		latitude: 34.0522,
		Country: "United States",
		State: "California",
		bird_name: "Canada Goose",
		bird_scientific_name: "Branta canadensis",
		image_url: "https://storage.googleapis.com/mock-bucket/canada-goose.jpg",
	},
	{
		event_id: 4,
		user_id: 104,
		event_time: "2024-04-12T10:00:00",
		longitude: -122.4194,
		latitude: 37.7749,
		Country: "United States",
		State: "California",
		bird_name: "Western Gull",
		bird_scientific_name: "Larus occidentalis",
		image_url: "https://storage.googleapis.com/mock-bucket/western-gull.jpg",
	},
	{
		event_id: 5,
		user_id: 105,
		event_time: "2024-04-11T15:00:00",
		longitude: -122.4194,
		latitude: 37.7749,
		Country: "United States",
		State: "California",
		bird_name: "American Robin",
		bird_scientific_name: "Turdus migratorius",
		image_url: "https://storage.googleapis.com/mock-bucket/american-robin.jpg",
	},
	{
		event_id: 6,
		user_id: 106,
		event_time: "2024-04-10T12:00:00",
		longitude: -122.4194,
		latitude: 37.7749,
		Country: "United States",
		State: "California",
		bird_name: "Eastern Bluebird",
		bird_scientific_name: "Sialia sialis",
		image_url:
			"https://storage.googleapis.com/mock-bucket/eastern-bluebird.jpg",
	},
];

// Mock function to add new event
export const addMockEvent = (newEvent) => {
	// TODO: Replace with actual API call to backend - POST /api/events
	const event = {
		...newEvent,
		event_id: mockEvents.length + 1,
		user_id: 100 + mockEvents.length + 1,
		event_time: new Date().toISOString(),
	};
	mockEvents.push(event);
	return event;
};

// Mock function to get all events
export const getMockEvents = () => {
	// TODO: Replace with actual API call to backend - GET /api/events
	return [...mockEvents];
};

// Mock bird species data
export const mockBirdSpecies = [
	{
		bird_name: "American Crow",
		bird_scientific_name: "Corvus brachyrhynchos",
	},
	{
		bird_name: "Rock Pigeon",
		bird_scientific_name: "Columba livia",
	},
	{
		bird_name: "Canada Goose",
		bird_scientific_name: "Branta canadensis",
	},
	{
		bird_name: "Western Gull",
		bird_scientific_name: "Larus occidentalis",
	},
	{
		bird_name: "American Robin",
		bird_scientific_name: "Turdus migratorius",
	},
];

// US States data
export const usStates = [
	{ code: "AL", name: "Alabama" },
	{ code: "AK", name: "Alaska" },
	{ code: "AZ", name: "Arizona" },
	{ code: "AR", name: "Arkansas" },
	{ code: "CA", name: "California" },
	{ code: "CO", name: "Colorado" },
	{ code: "CT", name: "Connecticut" },
	{ code: "DE", name: "Delaware" },
	{ code: "FL", name: "Florida" },
	{ code: "GA", name: "Georgia" },
	{ code: "HI", name: "Hawaii" },
	{ code: "ID", name: "Idaho" },
	{ code: "IL", name: "Illinois" },
	{ code: "IN", name: "Indiana" },
	{ code: "IA", name: "Iowa" },
	{ code: "KS", name: "Kansas" },
	{ code: "KY", name: "Kentucky" },
	{ code: "LA", name: "Louisiana" },
	{ code: "ME", name: "Maine" },
	{ code: "MD", name: "Maryland" },
	{ code: "MA", name: "Massachusetts" },
	{ code: "MI", name: "Michigan" },
	{ code: "MN", name: "Minnesota" },
	{ code: "MS", name: "Mississippi" },
	{ code: "MO", name: "Missouri" },
	{ code: "MT", name: "Montana" },
	{ code: "NE", name: "Nebraska" },
	{ code: "NV", name: "Nevada" },
	{ code: "NH", name: "New Hampshire" },
	{ code: "NJ", name: "New Jersey" },
	{ code: "NM", name: "New Mexico" },
	{ code: "NY", name: "New York" },
	{ code: "NC", name: "North Carolina" },
	{ code: "ND", name: "North Dakota" },
	{ code: "OH", name: "Ohio" },
	{ code: "OK", name: "Oklahoma" },
	{ code: "OR", name: "Oregon" },
	{ code: "PA", name: "Pennsylvania" },
	{ code: "RI", name: "Rhode Island" },
	{ code: "SC", name: "South Carolina" },
	{ code: "SD", name: "South Dakota" },
	{ code: "TN", name: "Tennessee" },
	{ code: "TX", name: "Texas" },
	{ code: "UT", name: "Utah" },
	{ code: "VT", name: "Vermont" },
	{ code: "VA", name: "Virginia" },
	{ code: "WA", name: "Washington" },
	{ code: "WV", name: "West Virginia" },
	{ code: "WI", name: "Wisconsin" },
	{ code: "WY", name: "Wyoming" },
];

// Mock users data
export const mockUsers = [
	{
		user_id: 1,
		username: "john_doe",
		password: "password123", // In real app, passwords should be hashed
		name: "John Doe",
	},
	{
		user_id: 2,
		username: "jane_smith",
		password: "password456",
		name: "Jane Smith",
	},
	{
		user_id: 3,
		username: "admin",
		password: "admin123",
		name: "Admin User",
	},
];

// Mock function to authenticate user
export const authenticateUser = (username, password) => {
	// TODO: Replace with actual API call to backend - POST /api/auth/login
	const user = mockUsers.find(
		(user) => user.username === username && user.password === password
	);
	if (!user) {
		throw new Error("Invalid username or password");
	}
	return {
		user_id: user.user_id,
		username: user.username,
		name: user.name,
	};
};

// Mock function to search events
export const searchMockEvents = (keyword) => {
	// TODO: Replace with actual API call to backend - GET /api/events/search?q={keyword}
	if (!keyword || keyword.trim() === "") {
		return [...mockEvents]; // Return all events if no keyword
	}

	const searchTerm = keyword.toLowerCase().trim();

	return mockEvents.filter((event) => {
		const scientificName = event.bird_scientific_name.toLowerCase();
		return scientificName.includes(searchTerm);
	});
};

// Mock bird encyclopedia data
export const mockBirdEncyclopedia = [
	{
		bird_scientific_name: "Corvus brachyrhynchos",
		bird_common_name: "American Crow",
		bird_description:
			"The American crow is a large passerine bird species of the family Corvidae. It is a common bird found throughout much of North America. American crows are all-black birds with sturdy bills, broad wings, and short tails. They are known for their intelligence, adaptability, and complex social structures.",
	},
	{
		bird_scientific_name: "Columba livia",
		bird_common_name: "Rock Pigeon",
		bird_description:
			"The rock pigeon, also known as the rock dove, is a member of the bird family Columbidae. Wild rock pigeons are pale grey with two black bars on each wing, while domestic and feral pigeons are very variable in color and pattern. Rock pigeons are stout-bodied birds with short necks, and short, slender bills with a fleshy cere.",
	},
	{
		bird_scientific_name: "Branta canadensis",
		bird_common_name: "Canada Goose",
		bird_description:
			"The Canada goose is a large wild goose species with a black head and neck, white cheeks, white under its chin, and a brown body. It is native to the arctic and temperate regions of North America, and its migration occasionally reaches northern Europe. Canada geese are primarily herbivores, although they sometimes eat small insects and fish.",
	},
	{
		bird_scientific_name: "Larus occidentalis",
		bird_common_name: "Western Gull",
		bird_description:
			"The Western gull is a large white-headed gull that lives on the west coast of North America. It has a white head and body, gray wings, and black wing tips. Western gulls typically live about 15 years, but some have been recorded to live up to 25 years. These birds aggressively protect their nesting sites and foraging areas.",
	},
	{
		bird_scientific_name: "Turdus migratorius",
		bird_common_name: "American Robin",
		bird_description:
			"The American robin is a migratory songbird of the true thrush genus and Turdidae, the wider thrush family. It is widely distributed throughout North America, wintering from southern Canada to central Mexico and along the Pacific Coast. American robins have grayish-brown upperparts and bright orange underparts, with a white throat streaked with black.",
	},
	{
		bird_scientific_name: "Sialia sialis",
		bird_common_name: "Eastern Bluebird",
		bird_description:
			"The Eastern bluebird is a small thrush found in open woodlands, farmlands, and orchards in eastern North America. Male Eastern bluebirds have a bright blue plumage on their head, back, and wings, with a reddish-brown breast. Females are less vibrant, with a duller blue coloration. They primarily feed on insects and small fruits.",
	},
	{
		bird_scientific_name: "Cardinalis cardinalis",
		bird_common_name: "Northern Cardinal",
		bird_description:
			"The Northern cardinal is a mid-sized songbird with a distinctive crest and a mask on the face that goes around the bill and eyes. Male cardinals are bright red, while females are pale brown with reddish tinges on their wings, tail, and crest. Cardinals do not migrate and are common visitors to bird feeders in eastern North America.",
	},
	{
		bird_scientific_name: "Cyanocitta cristata",
		bird_common_name: "Blue Jay",
		bird_description:
			"The Blue jay is a passerine bird native to eastern North America. It is characterized by its bright blue crest, back, wings, and tail, contrasting with its white face and underside. Blue jays are known for their intelligence, complex social systems, and noisy, bold behavior. They are omnivorous, eating nuts, seeds, insects, and occasionally small vertebrates.",
	},
	{
		bird_scientific_name: "Catharus guttatus",
		bird_common_name: "Hermit Thrush",
		bird_description:
			"The Hermit thrush is a medium-sized thrush known for its beautiful, flute-like song. It has a brown upper body and smudged spots on its pale underparts. Hermit thrushes are migratory, breeding in coniferous and mixed forests across Canada and the northern United States, and wintering in the southern United States and Central America.",
	},
	{
		bird_scientific_name: "Ardea herodias",
		bird_common_name: "Great Blue Heron",
		bird_description:
			"The Great blue heron is a large wading bird in the heron family, common near the shores of open water and in wetlands over most of North America. It is a large bird, with a slate-gray body, chestnut and black accents, and very long legs and neck. Great blue herons are expert fishers, typically standing motionless in shallow water before striking out with their bill to capture prey.",
	},
];

// Mock function to search bird encyclopedia
export const searchBirdEncyclopedia = (query) => {
	if (!query || query.trim() === "") {
		return [...mockBirdEncyclopedia];
	}

	const searchTerm = query.toLowerCase().trim();

	return mockBirdEncyclopedia.filter((bird) => {
		const scientificName = bird.bird_scientific_name.toLowerCase();
		return scientificName.includes(searchTerm);
	});
};

// Mock function to get bird details by scientific name
export const getBirdByScientificName = (scientificName) => {
	// TODO: Replace with actual API call to backend - GET /api/birds/{scientificName}
	return mockBirdEncyclopedia.find(
		(bird) => bird.bird_scientific_name === scientificName
	);
};
