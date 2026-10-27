// ── FormField ─────────────────────────────────────────────────────────────────
// Campo de texto genérico reutilizable para Login y SignUp.

interface FormFieldProps {
    field: string;
}

export default function FormField({ field }: FormFieldProps) {
    const fieldId = field.trim().toLowerCase().replace(/\s+/g, "-");
    const isPassword = field.toLowerCase().includes("contraseña");
    const isEmail = field.toLowerCase() === "email";
    const normalizedId = fieldId === "contraseña" ? "password" : fieldId;

    return (
        <div className="space-y-1">
            <label className="block text-amber-200 font-medium text-sm" htmlFor={normalizedId}>
                {field}:
            </label>
            <input
                type={isPassword ? "password" : isEmail ? "email" : "text"}
                id={normalizedId}
                name={normalizedId}
                required
                className="w-full px-3 py-2 bg-black/50 border border-amber-700/40 rounded text-amber-100 placeholder-amber-700/70 focus:outline-none focus:border-amber-500 transition-colors duration-200 text-sm cincel"
                placeholder={field}
            />
        </div>
    );
}