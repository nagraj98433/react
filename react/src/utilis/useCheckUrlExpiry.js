export const useCheckUrlExpiry = () => {
  return function (url) {
    // if (!url) {
    //   return false;
    // }
    // const dateIndex = url.indexOf("X-Amz-Date=");
    // const expiresIndex = url.indexOf("X-Amz-Expires=");
    // if (dateIndex !== -1 && expiresIndex !== -1) {
    //   const dateString = url.substring(
    //     dateIndex + "X-Amz-Date=".length,
    //     dateIndex + "X-Amz-Date=".length + 15
    //   );
    //   const expiryString = url.substring(
    //     expiresIndex + "X-Amz-Expires=".length
    //   );
    //   const expirySeconds = parseInt(expiryString, 10);
    //   const year = dateString.slice(0, 4);
    //   const month = dateString.slice(4, 6);
    //   const day = dateString.slice(6, 8);
    //   const hours = dateString.slice(9, 11);
    //   const minutes = dateString.slice(11, 13);
    //   const seconds = dateString.slice(13, 15);
    //   const expiryTime = new Date(
    //     year,
    //     month - 1,
    //     day,
    //     hours,
    //     minutes,
    //     seconds
    //   );
    //   expiryTime.setSeconds(expiryTime.getSeconds() + expirySeconds);
    //   let givenTime = new Date(expiryTime);
    //   // Get current time
    //   const currentTime = new Date().toUTCString();
    //   const regex = /GMT.*/;
    //   const dateStringWithoutGMTInfo = String(givenTime).replace(regex, "GMT");
    //   // Calculate difference in milliseconds
    //   const differenceInMilliseconds = Math.ceil(
    //     new Date(dateStringWithoutGMTInfo) - new Date(currentTime)
    //   );
    //   // Convert difference to hours
    //   const difference = differenceInMilliseconds / 1000;
    //   console.log(dateStringWithoutGMTInfo);
    //   console.log(currentTime);
    //   console.log(difference);
    //   if (difference <= 0) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // }
  };
};
