
import CustomImage from "@/components/reusable/custom_image";
import { useState } from "react";

interface AdminProductItemProps {
    product: {
        _id: string;
        name: string;
        price: number;
        image: string;
        category: string;
    };
    colors: {
        muted: string;
        border: string;
        background: string;
        primary: string;
        secondary: string;
        foreground: string;
    };
    onClick?: (product: AdminProductItemProps["product"]) => void;
    onDelete?: () => void
}

export function AdminProductItem({ product, colors, onClick, onDelete }: AdminProductItemProps) {


    return (
        <div
            key={product._id}
            style={{
                background: colors.muted,
                borderRadius: '0.75rem',
                padding: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                cursor: 'pointer',
                border: `1.5px solid ${colors.border}`,
                transition: 'box-shadow 0.2s',
            }}
            onClick={() => onClick?.(product)}
            tabIndex={0}
            role="group"
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                <CustomImage
                    src={product.image}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="mb-6"
                />
                <span style={{
                    fontWeight: 500,
                    fontSize: '1rem',
                    color: colors.primary,
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {product.name} <span style={{ color: colors.secondary }}>${product.price}</span>
                </span>
            </div>

            <button
                type="button"
                style={{
                    marginLeft: '1rem',
                    background: '#f87171',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.4rem 0.9rem',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                }}
                onClick={e => {
                    e.stopPropagation();
                    onDelete?.();
                }}
                aria-label={`Delete ${product.name}`}
            >
                X
            </button>
        </div>
    );
}
