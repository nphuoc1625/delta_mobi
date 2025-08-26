
import React from "react";

type DeleteDialogProps = {
    open: boolean;
    onAccept: () => void;
    onCancel: () => void;
    productName?: string;
    loading?: boolean;
};

export function DeleteDialog({ open, onAccept, onCancel, productName, loading = false }: DeleteDialogProps) {
    // Remove internal state - rely entirely on external open prop
    // This prevents the "only shows once" issue

    if (!open) return null;

    const handleAccept = () => {
        if (!loading) {
            onAccept();
        }
    };

    const handleCancel = () => {
        if (!loading) {
            onCancel();
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: "0.75rem",
                    padding: "2rem",
                    minWidth: "320px",
                    maxWidth: "90vw",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <div style={{ marginBottom: "1.5rem", fontWeight: 600, fontSize: "1.1rem", textAlign: "center" }}>
                    {`Are you sure you want to delete${productName ? ` "${productName}"` : ""}?`}
                </div>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
                    <button
                        type="button"
                        disabled={loading}
                        style={{
                            background: loading ? "#9ca3af" : "#f87171",
                            color: "#fff",
                            border: "none",
                            borderRadius: "0.5rem",
                            padding: "0.5rem 1.2rem",
                            fontWeight: 600,
                            cursor: loading ? "not-allowed" : "pointer",
                            minWidth: "80px",
                            opacity: loading ? 0.6 : 1,
                        }}
                        onClick={handleAccept}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                    <button
                        type="button"
                        disabled={loading}
                        style={{
                            background: loading ? "#9ca3af" : "#e5e7eb",
                            color: "#374151",
                            border: "none",
                            borderRadius: "0.5rem",
                            padding: "0.5rem 1.2rem",
                            fontWeight: 500,
                            cursor: loading ? "not-allowed" : "pointer",
                            minWidth: "80px",
                            opacity: loading ? 0.6 : 1,
                        }}
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteDialog;