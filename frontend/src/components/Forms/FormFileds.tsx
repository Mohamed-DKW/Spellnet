import FormField from "./FormField";
import PlanSelector from "./PlanSelector";
interface FormFieldsProps {
    fields: string[],
    isSignup: boolean,
    selectedPlan: string;
    setSelectedPlan: (planId: string) => void;
}

const FormFields = ({fields, isSignup, selectedPlan, setSelectedPlan} : FormFieldsProps) => {
    return (
        <>
            {fields.map((field, index) => {
                if (field === "Plan" && isSignup) {
                    return (
                        <PlanSelector
                            key={index}
                            selectedPlan={selectedPlan}
                            onSelect={setSelectedPlan}
                        />
                    );
                }
                return <FormField key={index} field={field} />;
            })}
        </>
    )
}
export default FormFields;