export const convertToDate = (timestamp) => {
  const date = new Date(timestamp)

  const formattedDate = date.toLocaleString()
  return formattedDate
}

export const isExpired = (timestamp) => {
  // Lấy thời điểm hiện tại (timestamp)
  const currentTimestamp = Date.now();

  // So sánh với thời điểm đưa vào
  return timestamp < currentTimestamp;
}