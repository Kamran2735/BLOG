import Breadcrumb from "@/components/breadcrumb";
import AboutSection from "@/components/aboutsection";
import PhilosophySection from "@/components/philosopy";

const About = () => {
  return (
    <>
      <Breadcrumb 
  items={[
    { 
      label: "About", 
      href: "/about", 
      description: "Learn about my web development journey" 
    }
  ]}
  variant="hero"
/>

      <AboutSection />
      <PhilosophySection />

    </>
  );
};

export default About;