
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-300px)] flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Oops! We couldn't find the page you're looking for.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="w-full sm:w-auto">Return to Home</Button>
            </Link>
            <Link to="/markets">
              <Button variant="outline" className="w-full sm:w-auto">
                Explore Markets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
