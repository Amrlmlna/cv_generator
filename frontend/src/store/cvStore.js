import { create } from "zustand"
import { persist } from "zustand/middleware"

const useCV = create(
  persist(
    (set) => ({
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        title: "",
        summary: "",
      },
      education: [],
      experience: [],
      skills: [],
      languages: [],
      certificates: [],
      templateId: "professional",
      colorScheme: "blue",

      setPersonalInfo: (info) => set({ personalInfo: info }),

      addEducation: (education) => set((state) => ({ education: [...state.education, education] })),
      updateEducation: (index, education) =>
        set((state) => ({
          education: state.education.map((item, i) => (i === index ? education : item)),
        })),
      removeEducation: (index) =>
        set((state) => ({
          education: state.education.filter((_, i) => i !== index),
        })),

      addExperience: (experience) => set((state) => ({ experience: [...state.experience, experience] })),
      updateExperience: (index, experience) =>
        set((state) => ({
          experience: state.experience.map((item, i) => (i === index ? experience : item)),
        })),
      removeExperience: (index) =>
        set((state) => ({
          experience: state.experience.filter((_, i) => i !== index),
        })),

      setSkills: (skills) => set({ skills }),
      setLanguages: (languages) => set({ languages }),
      setCertificates: (certificates) => set({ certificates }),

      setTemplate: (templateId) => set({ templateId }),
      setColorScheme: (colorScheme) => set({ colorScheme }),

      reset: () =>
        set({
          personalInfo: {
            fullName: "",
            email: "",
            phone: "",
            location: "",
            title: "",
            summary: "",
          },
          education: [],
          experience: [],
          skills: [],
          languages: [],
          certificates: [],
          templateId: "professional",
          colorScheme: "blue",
        }),
    }),
    {
      name: "cv-storage", // Name for localStorage entry
    },
  ),
)

export default useCV

