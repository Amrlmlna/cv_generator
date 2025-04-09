import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-secondary-900">404</h1>
      <p className="text-2xl font-semibold text-secondary-700 mt-4">Page Not Found</p>
      <p className="text-secondary-600 mt-2 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary mt-6">
        Return to Dashboard
      </Link>
    </div>
  )
}

export default NotFound

