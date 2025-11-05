import Header from "../components/Header";
import Hero from "../components/Hero";
import Mission from "../components/Mission";
import Gallery from "../components/Gallery";
import Reviews from "../components/Reviews";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Mission />
      <Gallery />
      <Reviews />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
