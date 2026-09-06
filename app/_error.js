import { useEffect } from "react";

function Error({ statusCode }) {
    useEffect(() => {
        if (statusCode) {
            console.error(`Error ${statusCode}`);
        }
    }, [statusCode]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>{statusCode ? `Error ${statusCode}` : "An error occurred"}</h1>
            <p>
                {statusCode === 404
                    ? "The page you are looking for does not exist."
                    : "Sorry, something went wrong."}
            </p>
        </div>
    );
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
