"use client";

import { Stack } from "@mui/material";
import useHomePage from "./useHomePage";
import AddressReport from "@/components/AddressReport";

const HomePage = () => {
  const { addressKeys } = useHomePage();

  return (
    <Stack spacing={2}>
      {addressKeys.map((key) => {
        const [id, address] = key.split("/");
        return <AddressReport key={key} id={id} address={address} />;
      })}
    </Stack>
  );
};

export default HomePage;
