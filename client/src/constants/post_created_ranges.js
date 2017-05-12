export const date_ranges = {default: "Anytime",
					 lastday: "Last 24 hours",
					 thisWeek: "This week",
					 thisMonth: "This month",
					 thisYear: "This year" };


//returns timestamp of a date with a number of years, months, days in the future or past
const getTimestampWithShift = (yearShift, monthShift, dayShift) => {
	const today  = new Date();
	return new Date(today.getFullYear()+(yearShift), today.getMonth()+(monthShift), today.getDate()+(dayShift)).getTime();
}

export const getDateTimestamp = (date_range) => {
	switch(date_range){
		case date_ranges["lastday"]:{
			return getTimestampWithShift(0,0,-1);
		}
		case date_ranges["thisWeek"]:{
			return getTimestampWithShift(0,0,-7);
		}
		case date_ranges["thisMonth"]:{
			return getTimestampWithShift(0,-1,0);
		}
		default:
		case date_ranges["thisYear"]:{
			return getTimestampWithShift(-1,0,0);
		}
	}
}