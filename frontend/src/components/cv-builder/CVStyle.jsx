"use client";
import useCV from "../../store/cvStore";

const CVStyle = () => {
  const { templateId, setTemplate, colorScheme, setColorScheme } = useCV();

  const templates = [
    {
      id: "professional",
      name: "Professional",
      description: "Clean and traditional layout for a professional look",
    },
    {
      id: "modern",
      name: "Modern",
      description: "Contemporary design with a creative touch",
    },
    {
      id: "minimalist",
      name: "Minimalist",
      description: "Simple and elegant design with minimal elements",
    },
    {
      id: "creative",
      name: "Creative",
      description: "Artistic design for creative professionals",
    },
    {
      id: "executive",
      name: "Executive",
      description: "Formal design for executives and senior professionals",
    },
    {
      id: "compact",
      name: "Compact",
      description: "Fits more information in less space",
    },
    {
      id: "elegant",
      name: "Elegant",
      description: "Sophisticated design with elegant typography",
    },
    {
      id: "technical",
      name: "Technical",
      description: "Design focused on technical skills and coding",
    },
    {
      id: "academic",
      name: "Academic",
      description: "Design for academic and research CVs",
    },
    {
      id: "chronological",
      name: "Chronological",
      description: "Timeline-based design emphasizing career progression",
    },
    {
      id: "functional",
      name: "Functional",
      description: "Skills-focused design for highlighting competencies",
    },
    {
      id: "infographic",
      name: "Infographic",
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

  // Update template immediately when selected
  const handleTemplateChange = (templateId) => {
    setTemplate(templateId);
  };

  // Update color scheme immediately when selected
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
              <div className="h-36 bg-secondary-100 border-b border-secondary-200 flex items-center justify-center">
                <span className="text-secondary-400 font-medium">
                  {template.name} Preview
                </span>
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
