import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// using API values directly, no local PaymentMethod type required here
import { getPaymentMethods } from "@/api/paymentApi";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (method: string) => void; // Changed from PaymentMethod to string
  total: number;
}

// PaymentModal will fetch available payment options from server and display
// the API-provided option names directly. We group them by inferred type.

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  onConfirm,
  total,
}) => {
  const [selected, setSelected] = useState<string>("");
  type PaymentOptionItem = { _id?: string; option?: string; Details?: string };
  type PaymentOptionsEntry = {
    _id?: string;
    PaymentOption?: PaymentOptionItem[];
    Status?: boolean;
    Payment_Options_id?: number;
    [key: string]: unknown;
  };
  const [methods, setMethods] = useState<PaymentOptionsEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    setLoading(true);
    getPaymentMethods()
      .then((res) => {
        if (!mounted) return;
        // res is the raw API array of payment option groups
        const raw = (res as PaymentOptionsEntry[]) || [];
        setMethods(raw);
        // choose first available option id as selected if present
        const firstGroup = Array.isArray(raw) && raw.length > 0 ? raw[0] : null;
        const firstOption =
          firstGroup &&
          Array.isArray(firstGroup.PaymentOption) &&
          firstGroup.PaymentOption.length > 0
            ? firstGroup.PaymentOption[0]
            : null;
        if (firstOption && firstOption._id) setSelected(firstOption._id);
        else if (firstOption && firstOption.option)
          setSelected(firstOption.option);
      })
      .catch((err) => {
        console.error("Failed to load payment methods", err);
        setMethods([]);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out opacity-100 pointer-events-auto">
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.15)] backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-2xl w-[420px] max-w-full max-h-[90vh] overflow-y-auto shadow-xl overflow-hidden relative z-10 flex flex-col">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="text-2xl font-bold text-left">
            {t("payment.title")}
          </div>
          <button
            className="text-2xl font-bold text-gray-500"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="flex flex-col gap-2 px-6 pt-2 pb-4 flex-1">
          {loading ? (
            <div className="py-6 text-center text-sm text-gray-500">
              {t("payment.loading")}
            </div>
          ) : methods.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-500">
              {t("payment.noMethods")}
            </div>
          ) : (
            // Render the API data as-is in the returned order. Each entry may
            // contain a PaymentOption array; render each PaymentOption in order.
            methods.flatMap((group: PaymentOptionsEntry) =>
              (Array.isArray(group.PaymentOption)
                ? group.PaymentOption
                : []
              ).map((opt: PaymentOptionItem, idx: number) => {
                const key = opt._id || `${group._id || "group"}_${idx}`;
                const value = opt._id || opt.option || key;
                return (
                  <label
                    key={key}
                    className="flex items-center justify-between py-2 cursor-pointer border-b border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      {/* show Details if present or name */}
                      <span className="font-medium text-base">
                        {opt.option || opt.Details || key}
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      checked={selected === value}
                      onChange={() => setSelected(value)}
                      className="accent-black w-5 h-5"
                    />
                  </label>
                );
              })
            )
          )}
        </div>
        <div className="flex flex-col gap-3 px-6 pb-6 pt-2">
          <button
            className="w-full py-3 rounded-xl text-lg font-semibold text-white bg-linear-to-r from-[#6A1B9A] to-[#D32F2F] shadow-md hover:opacity-90 transition-all"
            onClick={() => {
              // find the selected option inside the returned API groups
              let apiValue: string = selected;
              for (const group of methods as PaymentOptionsEntry[]) {
                const opts = Array.isArray(group.PaymentOption)
                  ? group.PaymentOption
                  : [];
                const found = opts.find(
                  (o) => (o._id || o.option) === selected
                );
                if (found) {
                  apiValue = found.option ?? found._id ?? String(selected);
                  break;
                }
              }
              onConfirm(apiValue);
            }}
            disabled={loading || methods.length === 0}
          >
            {t("payment.pay", { amount: `${total.toLocaleString()} XOF` })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
