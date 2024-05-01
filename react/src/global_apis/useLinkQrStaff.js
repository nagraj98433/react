import { useDispatch } from "react-redux";
import { useGlobalApiHandler } from "../utilis/useGlobalApiHandler";
import { useAmazonUrl } from "../utilis/useAmazonUrl";
import { handleStaffList } from "../store/staffSlice";
import { useSelector } from "react-redux";
import { useSessionChecker } from "../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../utilis/useFetchAmazonBucketUrls";
import axios from "axios";
import { useStaffList } from "./useStaffList";

export const useLinkQrStaff = () => {
  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const globalApiHandler = useGlobalApiHandler();
  const getStaffList = useStaffList();
  const dispatch = useDispatch();

  const staffList = useSelector((state) => state.staffData?.data);

  return async function (data) {
    const staffLinkQr = staffList?.Users?.map((staffDetails) => {
      const staffObject = {
        ...staffDetails,
        qr_codes: [],
      };
      console.log(staffObject);
      for (const orderFlow of data.orderFlow) {
        for (const node of orderFlow.nodes) {
          for (const group of node.node_group) {
            if (group?.node_group?.staffs?.includes(staffObject?.user_id)) {
              staffObject.qr_codes.push({
                qr_id: data.id,
                hierarchy: node.node_role + 1,
                rights: group.node_rights,
                node_id: node.node_id,
                node_role: node.node_role,
                group_id: group.node_group.id,
                orderFlow_id: orderFlow.order_flow_id,
              });
            } else {
              return staffObject;
            }
          }
        }
      }
      return staffObject;
    });
    if (staffLinkQr) {
      const amazonUrlResult = getAmazonUrl("users");
      const isNotExpired = amazonUrlExpiryChecker(amazonUrlResult?.expiry);

      if (!isNotExpired) {
        const requiredUrl = await fetchAmazonBucketUrls("users");

        const createQR = await axios.put(requiredUrl?.put_url, {
          ...staffList,
          Users: staffLinkQr,
        });
        if (createQR?.status === 200) {
          await getStaffList(requiredUrl?.get_url);
          return true;
        } else {
          return false;
        }
      } else {
        const amazonUrlResult = getAmazonUrl("users")?.url;
        const createQR = await axios.put(amazonUrlResult?.put_url, {
          ...staffList,
          Users: staffLinkQr,
        });
        if (createQR?.status === 200) {
          await getStaffList(amazonUrlResult?.get_url);
          return true;
        } else {
          return false;
        }
      }
    }
  };
};
