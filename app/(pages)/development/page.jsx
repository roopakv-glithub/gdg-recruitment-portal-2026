import React from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import DeptHero from "@/components/DeptHero";

const features = [
    {
        name: "∑_ApZ3V_gh",
        description:
            "k*N$5c fu900Q 7k3 C20Z!g 1kL1d3er & nUKpZg %AU0₹g!ir3C.",
        href: "/7349e360-afdf-476d-9af8-20d680067f0b",
        cta: "J01n_§x",
    },
    {
        name: "µ_Wb₹5D_lp",
        description:
            "bp05Lb(bTI, CZWSr₹#^Z *7J ^T( f391xQ 1kp #q₹X 3z!Kux 6j(IkL.",
        href: "/2bd84c7a-ee2a-48b7-9568-6a4b094d3618",
        cta: "J01n_§x",
    },
];

const page = () => {
    return (
        <main>
            <NavBar />
            <DeptHero dept={{ name: "Development Departments" }} />

            <div>
                <ul>
                    {features.map((feature) => (
                        <li key={feature.name}>
                            <h2>{feature.name}</h2>
                            <p>{feature.description}</p>
                            <Link href={feature.href}>{feature.cta}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
};

export default page;
