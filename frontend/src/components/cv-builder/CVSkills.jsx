"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import useCV from "../../store/cvStore";

const CVSkills = () => {
  const { skills, setSkills } = useCV();
  const [inputValue, setInputValue] = useState("");
  const [skillList, setSkillList] = useState(skills);

  useEffect(() => {
    setSkillList(skills);
  }, [skills]);

  const handleAddSkill = () => {
    if (!inputValue.trim()) return;

    const newSkills = [...skillList, inputValue.trim()];
    setSkillList(newSkills);
    setSkills(newSkills);
    setInputValue("");
  };

  const handleRemoveSkill = (index) => {
    const newSkills = skillList.filter((_, i) => i !== index);
    setSkillList(newSkills);
    setSkills(newSkills);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="skills" className="form-label">
          Skills
        </label>
        <div className="flex gap-2">
          <input
            id="skills"
            type="text"
            className="input flex-1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add skills (e.g., JavaScript, Project Management)"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="btn btn-primary whitespace-nowrap"
          >
            Add Skill
          </button>
        </div>
      </div>

      {skillList.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {skillList.map((skill, index) => (
            <div
              key={index}
              className="bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full flex items-center gap-1.5"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(index)}
                className="text-primary-700 hover:text-primary-900"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-secondary-600 mt-2">
        Add your relevant technical and soft skills. These will help employers
        quickly identify your qualifications.
      </p>
    </div>
  );
};

export default CVSkills;
