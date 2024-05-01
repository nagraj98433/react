export const useSessionChecker = () => {
  return function (session) {
    if (!session) {
      return false;
    }
    // Convert Unix timestamp to milliseconds (JavaScript uses milliseconds)
    const expirationDate = new Date(session * 1000); // Multiply by 1000 to convert seconds to milliseconds
    const currentDate = new Date();

    // Calculate the time difference in milliseconds
    const timeDifferenceMs = expirationDate.getTime() - currentDate.getTime();

    // Convert milliseconds to hours
    const totalHours = timeDifferenceMs / (1000 * 60 * 60);

    // Check if the difference is less than or equal to 2 hours
    if (totalHours === 0 || totalHours < 0) {
      return false; // URL has expired
    } else {
      return true; // URL has not expired
    }
  };
};
