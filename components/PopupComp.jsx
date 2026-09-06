"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PiArrowRightThin } from "react-icons/pi";

const PopupComp = ({ isOpen, onClose, PopupData }) => {
  if (!isOpen) return null;

  return (
    <div style={{ border: "1px solid black", padding: "16px", margin: "16px 0" }}>
      <h2>{PopupData?.header}</h2>
      <p>{PopupData?.description}</p>
      <ul>
        {PopupData?.message.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <button type="button" onClick={onClose}>
        Got it
      </button>
    </div>
  );
};

export default PopupComp;
