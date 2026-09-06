"use client";

import React from "react";

// MagicUI import
import BlurFade from "@/components/magicui/blur-fade";
import MagicCardComp from "./MagicCardComp";

// Constant Import
import { reviews } from "../constants/index";
import Link from "next/link";

export default function BlurFadeGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 ">
      {reviews.map((review) => (
        <BlurFade key={review.id} delay={0.025} inView>
          <Link key={review.id} href={`/${review.id}`}>
            <MagicCardComp review={review} />
          </Link>
        </BlurFade>
      ))}
    </div>
  );
}
