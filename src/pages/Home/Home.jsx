import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import About from '../../components/About/About';
import Features from '../../components/Features/Features';
import Gallery from '../../components/Gallery/Gallery';
import Download from '../../components/Download/Download';
import Developers from '../../components/Developers/Developers';
import Footer from '../../components/Footer/Footer';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Gallery />
      <Download />
      <Developers />
      <Footer />
    </div>
  );
}

export default Home;