export const getNextOccurrence = (recurrence, startDate) => {
    if (!recurrence || !startDate) return null; // Return null if either recurrence or startDate is not provided

    const start = new Date(startDate); // Convert the startDate to a Date object

    switch (recurrence.toLowerCase()) {
        case "daily" :
            return new Date(start.setDate(start.getDate() + 1)); // Increment the date by 1 day
        case "weekly":
            return new Date(start.setDate(start.getDate() + 7)); // Increment the date by 7 days
        case "monthly":
            return new Date(start.setMonth(start.getMonth() + 1)); // Increment the month by 1
        case "yearly":
            return new Date(start.setFullYear(start.getFullYear() + 1)); // Increment the year by 1
        default:
            return null; // Return null if the recurrence is not recognized
    }
}