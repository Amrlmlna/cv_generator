"use client";
import useCV from "../../store/cvStore";

const CVStyle = () => {
  const { templateId, setTemplate, colorScheme, setColorScheme } = useCV();

  const templates = [
    {
      id: "professional",
      name: "Professional",
      image: "professional.png",
      description: "Clean and traditional layout for a professional look",
    },
    {
      id: "modern",
      name: "Modern",
      image: "modern.png",
      description: "Contemporary design with a creative touch",
    },
    {
      id: "minimalist",
      name: "Minimalist",
      image: "minimalist.png",
      description: "Simple and elegant design with minimal elements",
    },
    {
      id: "creative",
      name: "Creative",
      image: "creative.png",
      description: "Artistic design for creative professionals",
    },
    {
      id: "executive",
      name: "Executive",
      image: "executive.png",
      description: "Formal design for executives and senior professionals",
    },
    {
      id: "compact",
      name: "Compact",
      image: "compact.png",
      description: "Fits more information in less space",
    },
    {
      id: "elegant",
      name: "Elegant",
      image: "elegant.png",
      description: "Sophisticated design with elegant typography",
    },
    {
      id: "technical",
      name: "Technical",
      image: "technical.png",
      description: "Design focused on technical skills and coding",
    },
    {
      id: "academic",
      name: "Academic",
      image: "academic.png",
      description: "Design for academic and research CVs",
    },
    {
      id: "chronological",
      name: "Chronological",
      image: "chronological.png",
      description: "Timeline-based design emphasizing career progression",
    },
    {
      id: "functional",
      name: "Functional",
      image: "functional.png",
      description: "Skills-focused design for highlighting competencies",
    },
    {
      id: "infographic",
      name: "Infographic",
      image: "infographic.png",
      description: "Visual design with graphic elements and data visualization",
    },
  ];

  const colorSchemes = [
    {
      id: "blue",
      name: "Blue",
      class: "bg-primary-600",
    },
    {
      id: "green",
      name: "Green",
      class: "bg-emerald-600",
    },
    {
      id: "purple",
      name: "Purple",
      class: "bg-violet-600",
    },
    {
      id: "gray",
      name: "Gray",
      class: "bg-gray-700",
    },
  ];

  const handleTemplateChange = (templateId) => {
    setTemplate(templateId);
  };

  const handleColorChange = (colorId) => {
    setColorScheme(colorId);
  };

  return (
    <div className="space-y-8">
      {/* Template Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Choose a Template</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                templateId === template.id
                  ? "border-primary-600 ring-2 ring-primary-200"
                  : "border-secondary-200 hover:border-secondary-300"
              }`}
              onClick={() => handleTemplateChange(template.id)}
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={`/images/${template.image}`}
                  alt={`${template.name} Preview`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center">
                  <span className="text-white font-medium text-center text-sm drop-shadow">
                    {template.name} Preview
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-medium text-secondary-900">
                  {template.name}
                </h3>
                <p className="text-sm text-secondary-600 mt-1">
                  {template.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Scheme Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Choose a Color Scheme</h2>
        <div className="flex flex-wrap gap-4">
          {colorSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className={`relative cursor-pointer transition-transform ${
                colorScheme === scheme.id ? "scale-110" : "hover:scale-105"
              }`}
              onClick={() => handleColorChange(scheme.id)}
            >
              <div
                className={`w-12 h-12 rounded-full ${scheme.class} shadow-md`}
                title={scheme.name}
              ></div>
              {colorScheme === scheme.id && (
                <div className="absolute inset-0 border-2 border-white rounded-full shadow-lg"></div>
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-secondary-600 mt-3">
          Choose a color that matches your professional identity and industry.
        </p>
      </div>
    </div>
  );
};

export default CVStyle;
