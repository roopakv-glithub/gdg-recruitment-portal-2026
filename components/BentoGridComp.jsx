// "use client";

// // Grid Component
// import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";

// import DeptHero from "./DeptHero";

// // Icons
// import { PiFileLockThin } from "react-icons/pi";
// import { PiBrainThin } from "react-icons/pi";
// import { PiCodeThin } from "react-icons/pi";
// import { PiAndroidLogoThin } from "react-icons/pi";
// import { PiNoteThin } from "react-icons/pi";
// import { PiSuitcaseSimpleThin } from "react-icons/pi";
// import { PiPolygonThin } from "react-icons/pi";
// import { PiPaintBrushBroadThin } from "react-icons/pi";
// import { PiCameraThin } from "react-icons/pi";
// import { PiMoneyWavyThin } from "react-icons/pi";
// import { PiCodeSimpleThin } from "react-icons/pi";
// // Constant Import
// import { reviews } from "../constants/index";

// let features = [
//     {
//         Icon: PiBrainThin,
//         name: "Development",
//         description: "We automatically save your files as you type.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
//     },
//     {
//         Icon: PiCodeSimpleThin,
//         name: "Full text search",
//         description: "Search through all your files in one place.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
//     },
//     {
//         Icon: PiAndroidLogoThin,
//         name: "Multilingual",
//         description: "Supports 100+ languages and counting.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
//     },
//     {
//         Icon: PiCodeThin,
//         name: "Calendar",
//         description: "Use the calendar to filter your files by date.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
//     },
//     {
//         Icon: PiFileLockThin,
//         name: "Notifications",
//         description:
//             "Get notified when someone shares a file or mentions you in a comment.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
//     },
//     {
//         Icon: PiPaintBrushBroadThin,
//         name: "Save your files",
//         description: "We automatically save your files as you type.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
//     },
//     {
//         Icon: PiSuitcaseSimpleThin,
//         name: "Full text search",
//         description: "Search through all your files in one place.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
//     },
//     {
//         Icon: PiPolygonThin,
//         name: "Multilingual",
//         description: "Supports 100+ languages and counting.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
//     },
//     {
//         Icon: PiNoteThin,
//         name: "Calendar",
//         description: "Use the calendar to filter your files by date.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
//     },
//     {
//         Icon: PiCameraThin,
//         name: "Notifications",
//         description:
//             "Get notified when someone shares a file or mentions you in a comment.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
//     },
//     {
//         Icon: PiMoneyWavyThin,
//         name: "Notifications",
//         description:
//             "Get notified when someone shares a file or mentions you in a comment.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
//     },
// ];

// let used = 0;

// reviews.forEach((r, index) => {
//     let f = features[index];
//     if (r.name !== "App Development" && r.name !== "Web Development") {
//         f.name = r.name;
//         if (r.name === "Photography") {
//             f.name = "Photography / Video Editing";
//         }
//         f.description = r.body;
//         f.href = r.id;
//         f.cta = "Join Department";
//     } else {
//         if (used === 0) {
//             (f.name = "Development"),
//                 (f.description =
//                     "Developing and maintaining web applications and software."),
//                 (f.href = "/development"),
//                 (f.cta = "Join Department");
//             used = 1;
//         } else {
//             (f.name = "null"),
//                 (f.description = ""),
//                 (f.href = ""),
//                 (f.cta = "...");
//         }
//     }
// });

// export default async function BentoGridComp() {
//     return (
//         <div className="flex flex-col gap-4">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                 <DeptHero dept={{ name: "Technical Departments" }} />
//                 <div className="flex flex-col gap-4 justify-center items-between p-5">
//                     {features.slice(0, 5).map((feature) => (
//                         <div key={feature.name}>
//                             {feature.name !== "null" && (
//                                 <BentoCard key={feature.name} {...feature} />
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             <DeptHero dept={{ name: "Non Technical Departments" }} />
//             <div className="p-5 flex flex-col gap-4">
//                 <BentoGrid className="lg:grid-rows-3">
//                     {features.slice(5, 10).map((feature) => (
//                         <BentoCard key={feature.name} {...feature} />
//                     ))}
//                 </BentoGrid>
//                 <BentoCard
//                     className="m-5"
//                     key={features[10].name}
//                     {...features[10]}
//                 />
//             </div>
//         </div>
//     );
// }




/*
  File: app/page.js (or wherever your BentoGridComp is located)
  -------------------------------------------------------------
  This is your component, now updated to import and use the Card component for testing.
*/

// "use client";

// // Grid Component
// import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
// import Card from '@/components/Card'; // <-- IMPORT THE CUSTOM CARD

// import DeptHero from "./DeptHero";

// // Icons
// import { PiFileLockThin } from "react-icons/pi";
// import { PiBrainThin } from "react-icons/pi";
// import { PiCodeThin } from "react-icons/pi";
// import { PiAndroidLogoThin } from "react-icons/pi";
// import { PiNoteThin } from "react-icons/pi";
// import { PiSuitcaseSimpleThin } from "react-icons/pi";
// import { PiPolygonThin } from "react-icons/pi";
// import { PiPaintBrushBroadThin } from "react-icons/pi";
// import { PiCameraThin } from "react-icons/pi";
// import { PiMoneyWavyThin } from "react-icons/pi";
// import { PiCodeSimpleThin } from "react-icons/pi";
// // Constant Import
// import { reviews } from "../constants/index";

// let features = [
//     {
//         Icon: PiBrainThin,
//         name: "Development",
//         description: "We automatically save your files as you type.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
//     },
//     {
//         Icon: PiCodeSimpleThin,
//         name: "Full text search",
//         description: "Search through all your files in one place.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
//     },
//     {
//         Icon: PiAndroidLogoThin,
//         name: "Multilingual",
//         description: "Supports 100+ languages and counting.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
//     },
//     {
//         Icon: PiCodeThin,
//         name: "Calendar",
//         description: "Use the calendar to filter your files by date.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
//     },
//     {
//         Icon: PiFileLockThin,
//         name: "Notifications",
//         description:
//             "Get notified when someone shares a file or mentions you in a comment.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
//     },
//     {
//         Icon: PiPaintBrushBroadThin,
//         name: "Save your files",
//         description: "We automatically save your files as you type.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
//     },
//     {
//         Icon: PiSuitcaseSimpleThin,
//         name: "Full text search",
//         description: "Search through all your files in one place.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
//     },
//     {
//         Icon: PiPolygonThin,
//         name: "Multilingual",
//         description: "Supports 100+ languages and counting.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
//     },
//     {
//         Icon: PiNoteThin,
//         name: "Calendar",
//         description: "Use the calendar to filter your files by date.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
//     },
//     {
//         Icon: PiCameraThin,
//         name: "Notifications",
//         description:
//             "Get notified when someone shares a file or mentions you in a comment.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
//     },
//     {
//         Icon: PiMoneyWavyThin,
//         name: "Notifications",
//         description:
//             "Get notified when someone shares a file or mentions you in a comment.",
//         href: "/",
//         cta: "Learn more",
//         background: <img className="absolute -right-20 -top-20 opacity-60" />,
//         className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
//     },
// ];

// let used = 0;

// reviews.forEach((r, index) => {
//     let f = features[index];
//     if (r.name !== "App Development" && r.name !== "Web Development") {
//         f.name = r.name;
//         if (r.name === "Photography") {
//             f.name = "Photography / Video Editing";
//         }
//         f.description = r.body;
//         f.href = r.id;
//         f.cta = "Join Department";
//     } else {
//         if (used === 0) {
//             (f.name = "Development"),
//                 (f.description =
//                     "Developing and maintaining web applications and software."),
//                 (f.href = "/development"),
//                 (f.cta = "Join Department");
//             used = 1;
//         } else {
//             (f.name = "null"),
//                 (f.description = ""),
//                 (f.href = ""),
//                 (f.cta = "...");
//         }
//     }
// });

// export default async function BentoGridComp() {
//     return (
//         <div className="flex flex-col gap-4 bg-black text-white p-4">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                 <DeptHero dept={{ name: "Technical Departments" }} />
//                 <div className="flex flex-col gap-4 justify-center items-between p-5">
//                     {features.slice(0, 5).map((feature) => (
//                         <div key={feature.name}>
//                             {feature.name !== "null" && (
//                                 <BentoCard key={feature.name} {...feature} />
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             <DeptHero dept={{ name: "Non Technical Departments" }} />
//             <div className="p-5 flex flex-col gap-4">
//                 <BentoGrid className="lg:grid-rows-3">
//                     {features.slice(5, 10).map((feature) => (
//                         <BentoCard key={feature.name} {...feature} />
//                     ))}
//                 </BentoGrid>
//                 <BentoCard
//                     className="m-5"
//                     key={features[10].name}
//                     {...features[10]}
//                 />
//             </div>

//             {/* --- Card Component Test Section --- */}
//             <div className="p-5 border-t border-gray-700 mt-8">
//                 <h2 className="text-2xl font-bold mb-4 text-center">Testing Custom Card Component</h2>
//                 <div className="flex justify-center">
//                     <Card
//                         borderColor="#A4C639"
//                         icon={<PiAndroidLogoThin size={48} />}
//                         placeholderText="This is a test of the global Card component."
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }






"use client";

// Grid Component
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import Card from '@/components/Card'; // <-- IMPORT THE NEW CARD

import DeptHero from "./DeptHero";

// Icons
import { PiFileLockThin, PiBrainThin, PiCodeThin, PiAndroidLogoThin, PiNoteThin, PiSuitcaseSimpleThin, PiPolygonThin, PiPaintBrushBroadThin, PiCameraThin, PiMoneyWavyThin, PiCodeSimpleThin, PiGameControllerThin, PiCurrencyBtcThin, PiSwatchesThin, PiCloudThin } from "react-icons/pi";
// Constant Import
import { reviews } from "../constants/index";

// This data is just for the test section at the bottom
const cardTestData = [
  {
    title: "Cloud & DevOps",
    description: "Build robust cloud infrastructure, CI/CD pipelines, and scalable microservices with modern Cloud and DevOps practices.",
    bgColor: "#FFC700",
    Icon: PiCloudThin,
  },
  {
    title: "Game Dev",
    description: "Where imagination meets code. Welcome to the Game Dev department. We craft interactive experiences, one pixel and line of code at a time.",
    bgColor: "#2D7CF8",
    Icon: PiGameControllerThin,
  },
  {
    title: "App Dev",
    description: "The App Dev Department is where innovation meets functionality. From UI to backend, we build seamless mobile experiences.",
    bgColor: "#F34236",
    Icon: PiAndroidLogoThin,
  },
  {
    title: "UI/UX",
    description: "Design makes science visible. In the UI/UX Dept, we craft intuitive interfaces and experiences that make a lasting impact.",
    bgColor: "#009E57",
    Icon: PiSwatchesThin,
  },
];


let features = [
    {
        Icon: PiBrainThin,
        name: "Development",
        description: "We automatically save your files as you type.",
        href: "/",
        cta: "Learn more",
        background: <img alt="" className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
        Icon: PiCodeSimpleThin,
        name: "Full text search",
        description: "Search through all your files in one place.",
        href: "/",
        cta: "Learn more",
        background: <img alt="" className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
        Icon: PiAndroidLogoThin,
        name: "Multilingual",
        description: "Supports 100+ languages and counting.",
        href: "/",
        cta: "Learn more",
        background: <img alt="" className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
        Icon: PiCodeThin,
        name: "Calendar",
        description: "Use the calendar to filter your files by date.",
        href: "/",
        cta: "Learn more",
        background: <img alt="" className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
        Icon: PiFileLockThin,
        name: "Notifications",
        description:
            "Get notified when someone shares a file or mentions you in a comment.",
        href: "/",
        cta: "Learn more",
        background: <img alt="" className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
    {
        Icon: PiPaintBrushBroadThin,
        name: "Save your files",
        description: "We automatically save your files as you type.",
        href: "/",
        cta: "Learn more",
        background: <img alt="" className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
        Icon: PiSuitcaseSimpleThin,
        name: "Full text search",
        description: "Search through all your files in one place.",
        href: "/",
        cta: "Learn more",
        background: <img alt="" className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
        Icon: PiPolygonThin,
        name: "Multilingual",
        description: "Supports 100+ languages and counting.",
        href: "/",
        cta: "Learn more",
        background: <img alt="" className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
        Icon: PiNoteThin,
        name: "Calendar",
        description: "Use the calendar to filter your files by date.",
        href: "/",
        cta: "Learn more",
        background: <img alt="" className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
        Icon: PiCameraThin,
        name: "Notifications",
        description:
            "Get notified when someone shares a file or mentions you in a comment.",
        href: "/",
        cta: "Learn more",
        background: <img alt="" className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
    {
        Icon: PiMoneyWavyThin,
        name: "Notifications",
        description:
            "Get notified when someone shares a file or mentions you in a comment.",
        href: "/",
        cta: "Learn more",
        background: <img alt="" className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
];

let used = 0;

reviews.forEach((r, index) => {
    let f = features[index];
    if (r.name !== "App Development" && r.name !== "Web Development") {
        f.name = r.name;
        if (r.name === "Photography") {
            f.name = "Photography / Video Editing";
        }
        f.description = r.body;
        f.href = r.id;
        f.cta = "Join Department";
    } else {
        if (used === 0) {
            (f.name = "Development"),
                (f.description =
                    "Developing and maintaining web applications and software."),
                (f.href = "/development"),
                (f.cta = "Join Department");
            used = 1;
        } else {
            (f.name = "null"),
                (f.description = ""),
                (f.href = ""),
                (f.cta = "...");
        }
    }
});

export default async function BentoGridComp() {
    return (
        <div className="flex flex-col gap-4 bg-black text-white p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <DeptHero dept={{ name: "Technical Departments" }} />
                <div className="flex flex-col gap-4 justify-center items-between p-5">
                    {features.slice(0, 5).map((feature) => (
                        <div key={feature.name}>
                            {feature.name !== "null" && (
                                <BentoCard key={feature.name} {...feature} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <DeptHero dept={{ name: "Non Technical Departments" }} />
            <div className="p-5 flex flex-col gap-4">
                <BentoGrid className="lg:grid-rows-3">
                    {features.slice(5, 10).map((feature) => (
                        <BentoCard key={feature.name} {...feature} />
                    ))}
                </BentoGrid>
                <BentoCard
                    className="m-5"
                    key={features[10].name}
                    {...features[10]}
                />
            </div>

        </div>
    );
}
