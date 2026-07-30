import React from "react";
import type { Address } from "../types";
import { Home, Briefcase, MapPin, Trash2, Check } from "lucide-react";

interface AddressCardProps {
  address: Address;
  isSelected?: boolean;
  onSelect?: (address: Address) => void;
  onSetDefault?: (id: string) => void;
  onDelete?: (id: string) => void;
  variant?: "default" | "checkout" | "order";
  className?: string;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isSelected = false,
  onSelect,
  onSetDefault,
  onDelete,
  variant = "default",
  className = "",
}) => {
  const getIcon = () => {
    const label = address.label?.toLowerCase() || "";
    if (label.includes("home")) return <Home className="size-4" />;
    if (label.includes("work")) return <Briefcase className="size-4" />;
    return <MapPin className="size-4" />;
  };

  const isCheckout = variant === "checkout";

  return (
    <div
      onClick={() => onSelect && onSelect(address)}
      className={`p-4 rounded-2xl border transition-all ${
        onSelect ? "cursor-pointer" : ""
      } ${
        isSelected
          ? "border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500/20 shadow-xs"
          : address.isDefault
          ? "bg-emerald-50/40 border-emerald-500/30"
          : "bg-white border-zinc-200 hover:border-zinc-300"
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3 items-start min-w-0">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              address.isDefault || isSelected
                ? "bg-emerald-600 text-white"
                : "bg-zinc-100 text-zinc-600"
            }`}
          >
            {getIcon()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-zinc-900 text-sm">
                {address.label}
              </span>
              {address.isDefault && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md uppercase">
                  Default
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-600 mt-1 font-medium truncate">
              {address.address}
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              {address.city}, {address.state} {address.zip}
            </p>
          </div>
        </div>

        {!isCheckout && (onSetDefault || onDelete) && (
          <div
            className="flex items-center gap-1 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {!address.isDefault && onSetDefault && (
              <button
                type="button"
                onClick={() => onSetDefault(address.id)}
                className="px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg border border-zinc-200 transition-colors"
              >
                Set Default
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(address.id)}
                className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Address"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        )}

        {isCheckout && isSelected && (
          <div className="size-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Check className="size-3 stroke-[3]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
