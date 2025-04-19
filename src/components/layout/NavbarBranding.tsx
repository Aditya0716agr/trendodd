
import { Link } from "react-router-dom";
import Logo from "@/components/home/Logo";

const NavbarBranding = () => {
  return (
    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <Logo />
    </Link>
  );
};

export default NavbarBranding;
