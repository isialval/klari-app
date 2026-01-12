import { createContext, ReactNode, useContext, useState } from "react";

type Product = {
  id: number;
  name: string;
  brand: string;
  image: any;
};

type Step = {
  id: number;
  name: string;
  order: number;
  product: Product | null;
};

type UserProfile = {
  skinType: string;
  goals: string[];
};

type RoutineContextType = {
  daySteps: Step[];
  nightSteps: Step[];
  setDaySteps: (steps: Step[]) => void;
  setNightSteps: (steps: Step[]) => void;
  updateStepProduct: (
    type: "day" | "night",
    stepId: number,
    product: Product | null
  ) => void;
  userProfile: UserProfile;
  setSkinType: (skinType: string) => void;
  setGoals: (goals: string[]) => void;
};

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

const initialDaySteps: Step[] = [
  { id: 1, name: "Limpiador", order: 1, product: null },
  {
    id: 3,
    name: "Serum",
    order: 3,
    product: {
      id: 7,
      name: "Niacinamide 10%",
      brand: "The Ordinary",
      image: require("../assets/images/product.jpg"),
    },
  },
  { id: 5, name: "Hidratante", order: 5, product: null },
  {
    id: 7,
    name: "Protector solar",
    order: 7,
    product: {
      id: 10,
      name: "Eucerin Sun Sensitive Protect Cream SPF50+",
      brand: "Eucerin",
      image: require("../assets/images/product.jpg"),
    },
  },
];

const initialNightSteps: Step[] = [
  { id: 1, name: "Limpiador", order: 1, product: null },
  { id: 3, name: "Serum", order: 3, product: null },
  { id: 5, name: "Hidratante", order: 5, product: null },
];

export function RoutineProvider({ children }: { children: ReactNode }) {
  const [daySteps, setDaySteps] = useState<Step[]>(initialDaySteps);
  const [nightSteps, setNightSteps] = useState<Step[]>(initialNightSteps);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);
  const setSkinType = (skinType: string) => {
    setUserProfile((prev) => ({ ...prev, skinType }));
  };

  const setGoals = (goals: string[]) => {
    setUserProfile((prev) => ({ ...prev, goals }));
  };

  const updateStepProduct = (
    type: "day" | "night",
    stepId: number,
    product: Product | null
  ) => {
    if (type === "day") {
      setDaySteps((prev) =>
        prev.map((step) => (step.id === stepId ? { ...step, product } : step))
      );
    } else {
      setNightSteps((prev) =>
        prev.map((step) => (step.id === stepId ? { ...step, product } : step))
      );
    }
  };

  return (
    <RoutineContext.Provider
      value={{
        daySteps,
        nightSteps,
        setDaySteps,
        setNightSteps,
        updateStepProduct,
        userProfile,
        setSkinType,
        setGoals,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
}

export function useRoutine() {
  const context = useContext(RoutineContext);
  if (!context) {
    throw new Error("useRoutine must be used within a RoutineProvider");
  }
  return context;
}

const initialProfile: UserProfile = {
  skinType: "Mixta",
  goals: ["Mejorar la textura de mi piel", "Reducir manchas"],
};
