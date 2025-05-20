export const styles = {
  card: "bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 sm:p-6 transition-all duration-300 ease-in-out",
  // cardHoverLine is not used with the new card style, but kept for potential future use or other components.
  cardHoverLine: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300",
  input: "w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition-all duration-200 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500",
  select: "w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition-all duration-200",
  statusBadge: (status: string) => {
    let baseStyle = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (status) {
      case 'denied':
      case 'inactive': // Added from ProjectManagement
        return `${baseStyle} bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-100`;
      case 'enabled':
      case 'active': // Added from ProjectManagement
        return `${baseStyle} bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-100`;
      case 'waiting':
      case 'pending': // Added from ProjectManagement
        return `${baseStyle} bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100`;
      case 'accepted':
        return `${baseStyle} bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100`;
      case 'working':
        return `${baseStyle} bg-purple-100 dark:bg-purple-700 text-purple-800 dark:text-purple-100`;
      default:
        return `${baseStyle} bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100`;
    }
  },
} as const;