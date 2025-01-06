import { Hero } from "./hero";
import { BlogsGrid } from "./blog-grid";
import Navbar from "./nav-bar";

export default function LandingPage(){
    return (
        <>
        <Navbar/>
        <Hero/>
        <BlogsGrid/>
        </>
    )
}