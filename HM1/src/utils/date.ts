export const getCurrentDate = (): Date => {
  const now = new Date();
  const offsetDays = parseInt(process.env.TIME_OFFSET || '0', 10);
  
  if (offsetDays > 0) {
    now.setDate(now.getDate() + offsetDays);
  }
  
  return now;
};