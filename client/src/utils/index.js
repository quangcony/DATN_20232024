export const daysLeft = (deadline) => {
  const difference = new Date(deadline).getTime() - Date.now();
  const remainingDays = difference / (1000 * 3600 * 24);

  return remainingDays.toFixed(0);
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (file, callback) => {
  // const img = new Image();
  // img.src = url;
  const fileType = file["type"];
  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
  if (!validImageTypes.includes(fileType)) {
    callback(false);
  } else {
    callback(true);
  }

  // if (img.complete) ;

  // img.onload = () => callback(true);
  // img.onerror = () => callback(false);
};
