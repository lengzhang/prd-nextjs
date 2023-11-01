import { useEffect, useState } from "react";

import { useAuthContext } from "@/context/AuthContext";
import { useLoadingBackdropContext } from "@/context/LoadingBackdropContext";
import { useSnackbar } from "notistack";

const useHomePage = () => {
  const { userInfo } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { handleLoadingState } = useLoadingBackdropContext();
  const [addressKeys, setAddressKeys] = useState<string[]>([]);

  useEffect(() => {
    if (userInfo !== null) {
      getList();
    }
  }, [userInfo]);

  const getList = async () => {
    if (userInfo === null) return;
    handleLoadingState(true);
    const searchParams = new URLSearchParams();
    searchParams.append("id", userInfo.id);
    const response = await fetch(
      `/api/reports/list-address?${searchParams.toString()}`
    );

    if (response.status !== 200) {
      const { message = "Unexpected service exception." } =
        await response.json();
      enqueueSnackbar(message, { variant: "error" });
      return;
    } else {
      const data = await response.json();
      setAddressKeys(data);
    }

    handleLoadingState(false);
  };

  return { addressKeys };
};

export default useHomePage;
