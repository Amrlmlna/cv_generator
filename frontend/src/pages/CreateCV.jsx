import { useNavigate } from "react-router-dom"
import CVForm from "../components/CVForm"

const CreateCV = () => {
  const navigate = useNavigate()

  // Handle successful CV creation
  const handleCVCreated = (cv) => {
    navigate("/my-cvs")
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2">Create New CV</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Fill in your information to create a professional CV. You can get AI-powered suggestions to improve your CV.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <CVForm onSubmitSuccess={handleCVCreated} />
      </div>
    </div>
  )
}

export default CreateCV

