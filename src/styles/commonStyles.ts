export const styles = {
  card: "group relative bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100 hover:bg-gradient-to-r hover:from-white hover:to-blue-50/50",
  cardHoverLine: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300",
  input: "w-full px-4 py-2.5 rounded-xl bg-blue-50/50 ring-1 ring-blue-100 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200",
  select: "w-full px-4 py-2.5 rounded-xl bg-blue-50/50 ring-1 ring-blue-100 text-gray-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200",
  statusBadge: (status: string) => `
    inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium 
    ${status === 'denied' ? 'bg-red-50/50 text-red-700 ring-1 ring-red-100' :
      status === 'enabled' ? 'bg-green-50/50 text-green-700 ring-1 ring-green-100' :
      status === 'waiting' ? 'bg-yellow-50/50 text-yellow-700 ring-1 ring-yellow-100' :
      status === 'accepted' ? 'bg-blue-50/50 text-blue-700 ring-1 ring-blue-100' :
      status === 'working' ? 'bg-purple-50/50 text-purple-700 ring-1 ring-purple-100' :
      'bg-gray-50/50 text-gray-700 ring-1 ring-gray-100'}
  `,
} as const; 