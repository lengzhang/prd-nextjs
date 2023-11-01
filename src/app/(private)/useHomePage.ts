import { useEffect, useState } from "react";

import { useAuthContext } from "@/context/AuthContext";
import { useLoadingBackdropContext } from "@/context/LoadingBackdropContext";

const useHomePage = () => {
  const { userInfo } = useAuthContext();
  const [addressKeys, setAddressKeys] = useState<string[]>([]);
  const { handleLoadingState } = useLoadingBackdropContext();

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

    const data = await response.json();
    setAddressKeys(data);
    handleLoadingState(false);
  };

  return { addressKeys };
};

export default useHomePage;
