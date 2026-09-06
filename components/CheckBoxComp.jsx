"use client";

import React from "react";

export const CheckBoxComp = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolveRef = ref || defaultRef;

    React.useEffect(() => {
      if (resolveRef.current) {
        resolveRef.current.indeterminate = Boolean(indeterminate);
      }
    }, [resolveRef, indeterminate]);
    return (
      <>
        <input type="checkbox" ref={resolveRef} {...rest} />
      </>
    );
  }
);

CheckBoxComp.displayName = "CheckBoxComp";
