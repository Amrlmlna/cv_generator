"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import useCV from "../../store/cvStore";

const CVLanguages = () => {
  const { languages, setLanguages } = useCV();
  const [languageList, setLanguageList] = useState(languages);
  const [language, setLanguage] = useState("");
  const [proficiency, setProficiency] = useState("Intermediate");

  useEffect(() => {
    setLanguageList(languages);
  }, [languages]);

  const proficiencyLevels = [
    "Beginner",
    "Elementary",
    "Intermediate",
    "Advanced",
    "Fluent",
    "Native",
  ];

  const handleAddLanguage = () => {
    if (!language.trim()) return;

    const newLanguage = {
      language: language.trim(),
      proficiency,
    };

    const newLanguages = [...languageList, newLanguage];
    setLanguageList(newLanguages);
    setLanguages(newLanguages);

    setLanguage("");
    setProficiency("Intermediate");
  };

  const handleRemoveLanguage = (index) => {
    const newLanguages = languageList.filter((_, i) => i !== index);
    setLanguageList(newLanguages);
    setLanguages(newLanguages);
  };

  return (
    <div className="space-y-6">
      {/* List of languages */}
      {languageList.length > 0 && (
        <div className="space-y-2">
          {languageList.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-secondary-50 p-3 rounded-md border border-secondary-200"
            >
              <div>
                <span className="font-medium">{item.language}</span>
                <span className="text-secondary-600 text-sm ml-2">
                  ({item.proficiency})
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveLanguage(index)}
                className="text-danger-500 hover:text-danger-700 p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Form to add languages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="language" className="form-label">
            Language
          </label>
          <input
            id="language"
            type="text"
            className="input"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="e.g., English, Spanish, French"
          />
        </div>

        <div>
          <label htmlFor="proficiency" className="form-label">
            Proficiency
          </label>
          <select
            id="proficiency"
            className="input"
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value)}
          >
            {proficiencyLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={handleAddLanguage}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
        >
          <Plus size={16} />
          <span>Add Language</span>
        </button>
      </div>
    </div>
  );
};

export default CVLanguages;
