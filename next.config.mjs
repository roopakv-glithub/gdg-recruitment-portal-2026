/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {
        root: process.cwd(),
    },
    poweredByHeader: false,
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "avatar.vercel.sh" },
        ],
    },
    async headers() {
        const securityHeaders = [
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "X-Frame-Options", value: "DENY" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
            { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ];

        return [
            { source: "/:path*", headers: securityHeaders },
            {
                source: "/api/:path*",
                headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }],
            },
        ];
    },
};

export default nextConfig;
