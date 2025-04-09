import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCareerPath = create(
  persist(
    (set) => ({
      formData: {
        currentSkills: [],
        interests: [],
        education: "",
        experience: "",
        goals: "",
      },
      careerPathResult: null,
      isLoading: false,
      error: null,

      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      setIsLoading: (isLoading) => set({ isLoading }),

      setCareerPathResult: (result) => set({ careerPathResult: result }),

      setError: (error) => set({ error }),

      resetForm: () =>
        set({
          formData: {
            currentSkills: [],
            interests: [],
            education: "",
            experience: "",
            goals: "",
          },
        }),

      resetAll: () =>
        set({
          formData: {
            currentSkills: [],
            interests: [],
            education: "",
            experience: "",
            goals: "",
          },
          careerPathResult: null,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: "career-path-storage",
    }
  )
);

export default useCareerPath;
