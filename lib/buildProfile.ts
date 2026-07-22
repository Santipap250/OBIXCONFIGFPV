import type { FlyingStyle } from "./pidAdvisor";

export interface BuildProfile {
  id: string;
  name: string;
  frame?: string;
  frameSizeInches?: number;
  motor?: string;
  motorKv?: number;
  propeller?: string;
  batteryCells?: number;
  batteryCapacityMah?: number;
  esc?: string;
  fc?: string;
  firmware?: string;
  receiver?: string;
  vtx?: string;
  camera?: string;
  flyingStyle?: FlyingStyle;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type BuildProfileInput = Omit<BuildProfile, "id" | "createdAt" | "updatedAt">;

export const emptyBuildProfileInput: BuildProfileInput = {
  name: "",
  frame: "",
  frameSizeInches: 5,
  motor: "",
  motorKv: 1700,
  propeller: "",
  batteryCells: 4,
  batteryCapacityMah: 1300,
  esc: "",
  fc: "",
  firmware: "",
  receiver: "",
  vtx: "",
  camera: "",
  flyingStyle: "freestyle",
  notes: "",
};

export const flyingStyleLabels: Record<FlyingStyle, string> = {
  freestyle: "Freestyle",
  cinematic: "Cinematic",
  longrange: "Long range",
  micro: "Micro",
};
