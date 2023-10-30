import IconImage from "@/components/IconImage";
import { CardHeader, CardHeaderProps } from "@mui/material";
import { FC } from "react";

const AuthCardHeader: FC<CardHeaderProps> = (props) => {
  return (
    <CardHeader
      {...props}
      style={{ paddingBottom: 0, ...props.style }}
      title={
        <>
          <IconImage width={32} />
          {props.title}
        </>
      }
      titleTypographyProps={{ display: "flex" }}
    />
  );
};

export default AuthCardHeader;
