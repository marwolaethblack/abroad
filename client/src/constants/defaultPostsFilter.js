const defaultPostsFilter = {
	country_from: "Slovakia",
	//country_in used only as a fallback if fetching a country from IP fails
	country_in:"Poland",
	category:"All",
	// loads the latest posts created this year
	sort:"latest",
	date_posted:"This year"
}

export default defaultPostsFilter;