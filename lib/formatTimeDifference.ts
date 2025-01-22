export function formatTimeDifference(createdAt: string): string {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffInMilliseconds = now.getTime() - createdDate.getTime();

    if (diffInMilliseconds < 0) {
        return "Invalid date"; 
    }

    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60)); 
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 2) {
        return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
        return createdDate.toLocaleDateString(); 
    }
}
