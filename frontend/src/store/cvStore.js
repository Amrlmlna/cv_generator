import { create } from "zustand";
import { persist } from "zustand/middleware";

// Create a store with subscription capability
const createCVStore = () => {
  const subscribers = new Set();

  const store = create(
    persist(
      (set, get) => ({
        // Personal Info
        personalInfo: {
          fullName: "",
          title: "",
          email: "",
          phone: "",
          location: "",
          summary: "",
        },
        setPersonalInfo: (info) => {
          set({ personalInfo: info });
          notifySubscribers();
        },

        // Education
        education: [],
        addEducation: (edu) => {
          set((state) => ({ education: [...state.education, edu] }));
          notifySubscribers();
        },
        updateEducation: (index, edu) => {
          set((state) => {
            const newEducation = [...state.education];
            newEducation[index] = edu;
            return { education: newEducation };
          });
          notifySubscribers();
        },
        removeEducation: (index) => {
          set((state) => ({
            education: state.education.filter((_, i) => i !== index),
          }));
          notifySubscribers();
        },

        // Experience
        experience: [],
        addExperience: (exp) => {
          set((state) => ({ experience: [...state.experience, exp] }));
          notifySubscribers();
        },
        updateExperience: (index, exp) => {
          set((state) => {
            const newExperience = [...state.experience];
            newExperience[index] = exp;
            return { experience: newExperience };
          });
          notifySubscribers();
        },
        removeExperience: (index) => {
          set((state) => ({
            experience: state.experience.filter((_, i) => i !== index),
          }));
          notifySubscribers();
        },

        // Skills
        skills: [],
        setSkills: (skills) => {
          set({ skills });
          notifySubscribers();
        },

        // Languages
        languages: [],
        setLanguages: (languages) => {
          set({ languages });
          notifySubscribers();
        },

        // Certificates
        certificates: [],
        setCertificates: (certificates) => {
          set({ certificates });
          notifySubscribers();
        },

        // Template and Style
        templateId: "professional",
        setTemplate: (templateId) => {
          set({ templateId });
          notifySubscribers();
        },
        colorScheme: "blue",
        setColorScheme: (colorScheme) => {
          set({ colorScheme });
          notifySubscribers();
        },

        // Reset the entire CV
        resetCV: () => {
          set({
            personalInfo: {
              fullName: "",
              title: "",
              email: "",
              phone: "",
              location: "",
              summary: "",
            },
            education: [],
            experience: [],
            skills: [],
            languages: [],
            certificates: [],
            templateId: "professional",
            colorScheme: "blue",
          });
          notifySubscribers();
        },

        // Subscribe to store changes
        subscribe: (callback) => {
          subscribers.add(callback);
          return () => subscribers.delete(callback);
        },
      }),
      {
        name: "cv-storage",
      }
    )
  );

  // Function to notify all subscribers
  function notifySubscribers() {
    subscribers.forEach((callback) => callback());
  }

  return store;
};

const cvStore = createCVStore();
const useCV = cvStore;

export default useCV;
