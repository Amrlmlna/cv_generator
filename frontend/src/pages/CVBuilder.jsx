"use client";

import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

import CVPersonalInfo from "../components/cv-builder/CVPersonalInfo";
import CVEducation from "../components/cv-builder/CVEducation";
import CVExperience from "../components/cv-builder/CVExperience";
import CVSkills from "../components/cv-builder/CVSkills";
import CVLanguages from "../components/cv-builder/CVLanguages";
import CVCertificates from "../components/cv-builder/CVCertificates";
import CVStyle from "../components/cv-builder/CVStyle";
import CVPreview from "../components/cv-builder/CVPreview";

const CVBuilder = () => {
  const [activeTab, setActiveTab] = useState("personal-info");

  const tabs = [
    { id: "personal-info", label: "Personal Info" },
    { id: "education", label: "Education" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "languages", label: "Languages" },
    { id: "certificates", label: "Certificates" },
    { id: "style", label: "Style & Template" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">CV Builder</h1>
        <p className="text-secondary-600">
          Create a professional CV to showcase your skills and experience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-lg shadow-card p-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full overflow-x-auto flex-nowrap justify-start mb-6 pb-2 border-b border-secondary-200">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600 rounded-none"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="personal-info">
                <CVPersonalInfo />
              </TabsContent>

              <TabsContent value="education">
                <CVEducation />
              </TabsContent>

              <TabsContent value="experience">
                <CVExperience />
              </TabsContent>

              <TabsContent value="skills">
                <CVSkills />
              </TabsContent>

              <TabsContent value="languages">
                <CVLanguages />
              </TabsContent>

              <TabsContent value="certificates">
                <CVCertificates />
              </TabsContent>

              <TabsContent value="style">
                <CVStyle />
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                const currentIndex = tabs.findIndex(
                  (tab) => tab.id === activeTab
                );
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1].id);
                }
              }}
              disabled={activeTab === tabs[0].id}
            >
              Previous
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                const currentIndex = tabs.findIndex(
                  (tab) => tab.id === activeTab
                );
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1].id);
                }
              }}
              disabled={activeTab === tabs[tabs.length - 1].id}
            >
              Next
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white rounded-lg shadow-card p-6 sticky top-4">
            <CVPreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;
