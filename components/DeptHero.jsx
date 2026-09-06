"use client";

import React, { useEffect } from "react";
import { Switch } from "@/components/ui/switch";

const DeptHero = ({ dept, setPhotoQs, photoQs, isLoading, setIsLoading }) => {
  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);
  return (
    <section>
      <h1>{!photoQs ? dept.name : "Video Editing"}</h1>
      {dept.body && <p>{dept.body}</p>}
      {dept.name === "Photography" && (
        <div>
          <label>
            <input
              type="checkbox"
              checked={photoQs}
              onChange={() => setPhotoQs(!photoQs)}
            />
            {" "}Switch to Video Editing?
          </label>
        </div>
      )}
      <hr />
    </section>
  );
};

export default DeptHero;
