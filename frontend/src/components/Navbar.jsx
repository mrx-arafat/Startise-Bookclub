import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            Library System
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/books">
              <Button variant="ghost">Books</Button>
            </Link>
            <Link to="/request-books">
              <Button variant="ghost">Request Books</Button>
            </Link>
            <Link to="/suggest-books">
              <Button variant="ghost">Suggest Books</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 