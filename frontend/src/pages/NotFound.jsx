import { Link } from "react-router-dom"
import { FaHome, FaExclamationTriangle } from "react-icons/fa"

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
      <FaExclamationTriangle className="text-yellow-500 text-6xl mb-4" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/dashboard" className="btn btn-primary flex items-center">
        <FaHome className="mr-2" /> Go to Dashboard
      </Link>
    </div>
  )
}

export default NotFound

