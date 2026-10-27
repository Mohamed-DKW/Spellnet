// ── ChangeName ────────────────────────────────────────────────────────────────
// Formulario para cambiar el nombre del aventurero.
// Envía un PATCH /api/user/name con el token JWT del localStorage y notifica
// al componente padre via onNameChanged para actualizar el estado sin recargar.
// El mensaje de éxito se resetea automáticamente a los 3 segundos.

import { useState } from "react";
import axios from "axios";
import API from "../../services/api";

interface ChangeNameProps {
    name: string;
    // Callback opcional: se llama con el nuevo nombre tras guardar correctamente
    onNameChanged?: (newName: string) => void;
}

type SaveStatus = "idle" | "loading" | "success" | "error";

export default function ChangeName({ name, onNameChanged }: ChangeNameProps) {
    const [value, setValue] = useState(name);
    const [status, setStatus] = useState<SaveStatus>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    // Solo habilita "Guardar" si el usuario ha modificado el campo
    const isDirty = value.trim() !== name.trim();

    const handleSave = async () => {
        if (!isDirty) return;

        if (value.trim().length === 0) {
            setErrorMsg("El nombre no puede estar vacío.");
            setStatus("error");
            return;
        }

        setStatus("loading");
        setErrorMsg("");

        try {
            const token = localStorage.getItem("token");
            await axios.patch(
                `${API}/api/user/name`,
                { name: value.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setStatus("success");
            onNameChanged?.(value.trim());
            // Limpia el feedback de éxito tras 3s
            setTimeout(() => setStatus("idle"), 3000);
        } catch (err: any) {
            setErrorMsg(err?.response?.data?.error ?? "Error al guardar el nombre.");
            setStatus("error");
        }
    };

    const handleCancel = () => {
        setValue(name);
        setStatus("idle");
        setErrorMsg("");
    };

    return (
        <div className="panel db-3">
            <div className="panel-header">
                <h3 className="panel-title">Cambiar Nombre del Aventurero</h3>
            </div>

            <div className="p-6">
                <p className="db-changename-hint">
                    Tu nombre de aventurero es como serás conocido en las tierras de SpellNet.
                </p>

                <div className="db-changename-row">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            setStatus("idle");
                            setErrorMsg("");
                        }}
                        className="input-field"
                        placeholder="Ingresa tu nuevo nombre..."
                        disabled={status === "loading"}
                        maxLength={50}
                    />

                    <button
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={!isDirty || status === "loading"}
                    >
                        {status === "loading" ? "Guardando…" : "Guardar"}
                    </button>

                    {/* Cancelar solo aparece si el usuario ha editado el input */}
                    {isDirty && (
                        <button
                            className="btn-ghost"
                            onClick={handleCancel}
                            disabled={status === "loading"}
                        >
                            Cancelar
                        </button>
                    )}
                </div>

                {status === "success" && (
                    <p className="db-changename-success">✓ Nombre actualizado correctamente.</p>
                )}

                {status === "error" && errorMsg && (
                    <p className="db-changename-error">⚠ {errorMsg}</p>
                )}

                <p className="db-changename-note">
                    Solo puedes cambiar tu nombre una vez cada 30 días.
                </p>
            </div>
        </div>
    );
}