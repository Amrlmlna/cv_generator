import { Link } from "react-router-dom"
import { FaEye, FaDownload } from "react-icons/fa"
import { formatDate } from "../utils/formatDate"

const PublicCVCard = ({ cv }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* CV Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">{cv.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Created: {formatDate(cv.created_at)}</p>
      </div>

      {/* CV Info */}
      <div className="p-4">
        <div className="mb-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Name:</span> {cv.full_name}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Email:</span> {cv.email}
          </p>
        </div>

        {/* Summary */}
        {cv.summary && (
          <div className="mb-3">
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{cv.summary}</p>
          </div>
        )}

        {/* Categories */}
        {cv.categories && cv.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {cv.categories.map((category) => (
              <span
                key={category.id}
                className="px-2 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* Skills */}
        {cv.skills && cv.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills:</p>
            <div className="flex flex-wrap gap-1">
              {cv.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between mt-2">
          <Link
            to={`/view-cv/${cv.id}`}
            className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            <FaEye className="mr-1" /> View
          </Link>

          <a
            href={cv.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            download
          >
            <FaDownload className="mr-1" /> Download
          </a>
        </div>
      </div>
    </div>
  )
}

export default PublicCVCard

