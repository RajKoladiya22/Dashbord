// import { Layout } from 'antd';
// import { useRef } from 'react';

// const { Header } = Layout;

// type HeaderNavProps = {
//   navFill?: boolean;
// } & React.HTMLAttributes<HTMLDivElement>;

// const HeaderNav = ({ navFill, ...others }: HeaderNavProps) => {
//   const nodeRef = useRef(null);

//   return <Header ref={nodeRef} {...others} />;
// };

// export default HeaderNav;


import React, { forwardRef, useMemo } from "react";
import { Layout } from "antd";

const { Header } = Layout;

type HeaderNavProps = {
  /** When true, applies a translucent background */
  navFill?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const HeaderNav = forwardRef<HTMLDivElement, HeaderNavProps>(
  ({ navFill = false, style, ...rest }, ref) => {
    // Memoize merged styles so we don’t recreate the object on every render
    const mergedStyle = useMemo(
      () => ({
        ...style,
        // background: navFill ? "rgba(255,255,255,0.5)" : "transparent",
        // backdropFilter: navFill ? "blur(8px)" : undefined,
        // transition: "background 0.3s, backdrop-filter 0.3s",
      }),
      [navFill, style]
    );

    return <Header ref={ref} style={mergedStyle} {...rest} />;
  }
);

// Wrap in React.memo to skip re-render unless navFill or other props change :contentReference[oaicite:0]{index=0}
export default React.memo(HeaderNav);
