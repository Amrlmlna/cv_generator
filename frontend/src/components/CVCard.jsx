import React from "react";
import { Link } from "react-router-dom";

export const CVCard = ({ cv }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="h-48 bg-gray-100 relative">
        {cv.previewImage ? (
          <img
            src={cv.previewImage || "/placeholder.svg"}
            alt={cv.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">{cv.template} Template</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{cv.title}</h3>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>By {cv.user.name}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(cv.created_at)}</span>
        </div>

        {cv.categories && cv.categories.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {cv.categories.map((category) => (
              <span
                key={category.id}
                className="text-xs bg-gray-100 px-2 py-1 rounded"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between gap-2">
          <Link
            to={`/view/${cv.id}`}
            className="text-sm px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors flex-1 text-center"
          >
            View CV
          </Link>
          <Link
            to={`/login?template=${cv.template}&ref=${cv.id}`}
            className="text-sm px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors flex-1 text-center"
          >
            Use Template
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CVCard;
