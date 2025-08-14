import Breadcrumb from "@/components/breadcrumb";
import ContactSection from "@/components/contactsection";

const Contact = () => {
  return (
    <>
      <Breadcrumb 
  items={[
    { 
      label: "Contact", 
      href: "/contact", 
      description: "Get in touch with me" 
    }
  ]}
  variant="hero"
/>

      <ContactSection />

    </>
  );
};

export default Contact;