const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-secondary-200 rounded-full"></div>
          <div className="w-12 h-12 border-4 border-t-primary-600 animate-spin rounded-full absolute left-0 top-0"></div>
        </div>
        <p className="mt-4 text-secondary-700 font-medium">Loading...</p>
      </div>
    </div>
  )
}

export default Loading

