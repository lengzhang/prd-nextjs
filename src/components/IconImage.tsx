import styled from "@emotion/styled";
import Image, { ImageProps } from "next/image";
import { FC } from "react";

const StyledImage = styled(Image)`
  margin-right: 0.5rem;
  justify-content: flex-start;
  align-items: flex-end;
  border-radius: 4px;
`;

const IconImage: FC<Pick<ImageProps, "width">> = ({ width }) => {
  return (
    <StyledImage
      alt="prd-icon"
      src="/favicon-32x32.png"
      width={width}
      height={width}
    />
  );
};

export default IconImage;
