import { Link } from "react-router-dom";
import PublicCVGallery from "../components/PublicCVGallery";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Create Your Professional CV Today
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Showcase your skills and experience with our professional CV
            templates. Stand out from the crowd and land your dream job.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-transparent hover:bg-white/10 border border-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </section>

      {/* CV Gallery Section */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          Explore CV Templates
        </h2>
        <PublicCVGallery />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">CVVVVVV</h3>
              <p className="text-gray-600">
                Create professional CVs with our easy-to-use platform. Stand out
                from the crowd and land your dream job.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Templates</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/templates/modern"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Modern
                  </Link>
                </li>
                <li>
                  <Link
                    to="/templates/classic"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Classic
                  </Link>
                </li>
                <li>
                  <Link
                    to="/templates/minimal"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Minimal
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Users</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-600 hover:text-blue-600">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/register?role=hr"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Register as HR
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} CVVVVVV. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
