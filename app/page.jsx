import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="portal-home">
      <NavBar />
      <main className="portal-content">
        <section className="recruitment-notice" aria-labelledby="notice-title">
          <img className="notice-icon theme-dark-image" src="/assets/reference-notice.png" alt="" width="112" height="113" />
          <img className="notice-icon theme-light-image" src="/assets/reference-notice-light.png" alt="" width="112" height="113" />
          <div className="notice-copy">
            <h2 id="notice-title">Recruitment Notice</h2>
            <p>Welcome to the recruitment portal.</p>
            <ul>
              <li>Sign in with your email address to begin your application.</li>
              <li>You can apply to up to two departments.</li>
              <li>Active session telemetry: <span className="telemetry-value">186</span></li>
            </ul>
          </div>
        </section>
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
