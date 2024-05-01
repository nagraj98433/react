import { useSelector } from "react-redux";

export const useAmazonUrl = () => {
  const amazonBucketUrls = useSelector(
    (state) => state.amazonBucketUrlData.data
  );

  return function (name) {
    return amazonBucketUrls[name] ? amazonBucketUrls[name] : null;
  };
};
