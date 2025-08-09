import Hero from "../../components/students/Hero";
import Companies from "../../components/students/Companies";
import CourseSection from "../../components/students/CourseSection";
import Testimonials from "../../components/students/TestimonialsSection";
import CallToAction from "../../components/students/CallToAction";
import Footer from "../../components/students/Footer";

const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-7 text-center">
      <Hero/>
      <Companies/>
      <CourseSection/>
      <Testimonials/>
      <CallToAction/>
      <Footer/>
    </div>
  )
};

export default Home;
