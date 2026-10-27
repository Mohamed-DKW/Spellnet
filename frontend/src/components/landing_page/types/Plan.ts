import { PlanBenefit } from "./PlanBenefit";
import { PlanClasses } from "./PlanColors";
export interface Plan {
    name: string;
    price: string;
    period: string;
    image: string;
    benefits: PlanBenefit[];
    classes: PlanClasses;
    popular?: boolean;
}