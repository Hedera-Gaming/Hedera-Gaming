import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Home, Rocket } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center pt-20">
      <div className="text-center animate-slide-in">
        <h1 className="mb-4 text-8xl font-bold glow-text">404</h1>
        <p className="mb-2 text-2xl font-medium">Lost in Space</p>
        <p className="mb-8 text-xl text-muted-foreground">
          The page you're looking for doesn't exist in this galaxy
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="hero" size="lg">
              <Home className="mr-2" />
              Return to Home
            </Button>
          </Link>
          <Link to="/game">
            <Button variant="glass" size="lg" className="hover-glow">
              <Rocket className="mr-2" />
              Launch Game
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
