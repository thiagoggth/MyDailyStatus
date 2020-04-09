import NavBar from "./NavBar";
import Logo from "./Logo";
import Link from "next/link";

const Header = () => (
    <section className="bg-gray-200">
        <Link href="/"><a><Logo /></a></Link>
        <NavBar />
    </section>
);

export default Header;