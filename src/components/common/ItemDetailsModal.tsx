import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useWalkthroughStore } from "@/store/walkthroughStore";
import type { OrderItem } from "@/types/order";
import backIcon from "@/assets/back.svg";
import { useGetItemWithVariantsQuery } from "@/redux/api/quickOrderSlice";
import Loader from "@/components/Loader";

interface ItemDetailsModalProps {
  open: boolean;
  item: OrderItem | null;
  onClose: () => void;
  // onSelect receives selected variant info (id could be item_map_Variants_id or item_Variants_id)
  onSelect: (variant: {
    id?: number | string | null;
    label: string;
    price?: number;
  }) => void;
}

type Variant = {
  item_Variants_id?: number;
  Variants: string; // label like 'S', 'M', 'L'
  prices?: number; // delta or absolute depending on API
  item_map_Variants_id?: number;
};

const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  open,
  item,
  onClose,
  onSelect,
}) => {
  const isWalkthroughActive = useWalkthroughStore((s) => s.isActive);
  const { t } = useTranslation();
  const [selectedSize, setSelectedSize] = useState<string>("S");
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [variants, setVariants] = useState<Variant[] | null>(null);

  // derive maybeId from item (keeps same detection logic)
  const anyItem = item as unknown as Record<string, unknown>;
  let maybeIdVal: number | string | undefined = undefined;
  if (item) {
    const detected =
      (anyItem.Items_id as unknown as number | undefined) ??
      (anyItem.ItemsId as unknown as number | undefined) ??
      (Number.isFinite(Number(anyItem.itemId))
        ? Number(anyItem.itemId)
        : (anyItem.itemId as string | undefined));
    maybeIdVal = detected as number | string | undefined;
  }

  const {
    data: itemWithVariants,
    isFetching,
    isLoading,
  } = useGetItemWithVariantsQuery((maybeIdVal ?? "") as unknown as string, {
    skip: !maybeIdVal,
  });

  // compute loading state
  const loadingVariants =
    Boolean(isLoading || isFetching) && Boolean(maybeIdVal);

  useEffect(() => {
    setSelectedSize("S");
    setVariants(null);
    if (!itemWithVariants) return;
    const resp = itemWithVariants as unknown as {
      data?: { Variants?: unknown[] };
      Variants?: unknown[];
    };
    const dataVars = resp.data?.Variants ?? resp.Variants;
    if (dataVars && Array.isArray(dataVars) && dataVars.length) {
      const v: Variant[] = (dataVars || []).map((vv: unknown) => {
        const vobj = vv as Record<string, unknown>;
        return {
          item_Variants_id: (vobj.item_Variants_id as number) ?? undefined,
          Variants: (vobj.Variants as string) ?? String(vobj.Variants ?? ""),
          prices: (vobj.prices as number) ?? undefined,
          item_map_Variants_id:
            (vobj.item_map_Variants_id as number) ?? undefined,
        } as Variant;
      });
      setVariants(v.length ? v : null);
      if (v.length) setSelectedSize(v[0].Variants);
    }
  }, [itemWithVariants]);

  // when API data arrives, pick the first variant as selected
  useEffect(() => {
    if (!itemWithVariants) return;
    const resp2 = itemWithVariants as unknown as {
      data?: { Variants?: unknown[] };
      Variants?: unknown[];
    };
    const arr = resp2.data?.Variants ?? resp2.Variants ?? [];
    if (Array.isArray(arr) && arr.length) {
      const first = arr[0] as Record<string, unknown>;
      const label = (first.Variants as string) ?? String(first.Variants ?? "");
      setSelectedSize(label);
    }
  }, [itemWithVariants]);

  if (!open || !item) return null;

  // Truncate description for preview
  const descPreview =
    item.description && item.description.length > 80 && !showFullDesc
      ? item.description.slice(0, 80) + "..."
      : item.description;

  // Only use variants returned from API — no fallback sizes. Caller expects variant id.
  const sizeOptions: Variant[] = variants && variants.length ? variants : [];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      style={{ zIndex: isWalkthroughActive ? 11000 : undefined }}
    >
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.15)] backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="bg-white rounded-2xl w-[370px] max-w-full shadow-xl overflow-hidden relative flex flex-col item-details-modal"
        style={{
          minHeight: 600,
          zIndex: isWalkthroughActive ? 11001 : undefined,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-center relative px-0 pt-6 pb-2">
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-1"
            onClick={onClose}
            aria-label={t("itemDetails.back")}
          >
            <img
              src={backIcon}
              alt={t("itemDetails.back")}
              className="w-5 h-5"
            />
          </button>
          <div className="text-xl font-bold text-center w-full">
            {t("itemDetails.title")}
          </div>
        </div>

        {/* Image */}
        <div className="px-6">
          <img
            src={item.image || "https://via.placeholder.com/120x120?text=Item"}
            alt={item.name}
            className="w-full h-[160px] object-cover rounded-xl mb-4"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-6">
          {loadingVariants ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            <>
              {/* Title & Subtitle */}
              <div className="font-semibold text-lg mb-0.5 text-left">
                {item.name}
              </div>
              <div className="text-[#00000099] text-sm mb-4 text-left">
                {item.itemType}
              </div>

              {/* Description */}
              <div className="font-semibold text-xl mb-1 text-left">
                {item.name}
              </div>
              <div className="text-[#00000099] text-sm mb-4 text-left font-normal">
                {descPreview}
                {item.description &&
                  item.description.length > 80 &&
                  !showFullDesc && (
                    <span
                      className="text-primary-gradient cursor-pointer ml-1 text-sm font-normal"
                      onClick={() => setShowFullDesc(true)}
                    >
                      {t("itemDetails.readMore")}
                    </span>
                  )}
              </div>

              {/* Size */}
              <div className="w-full mb-6">
                <div className="font-semibold mb-2 text-left">
                  {t("itemDetails.variants")}
                </div>
                <div className="flex gap-3 justify-start item-size-options">
                  {sizeOptions.map((opt) => (
                    <button
                      key={opt.item_map_Variants_id ?? opt.Variants}
                      className={`w-14 h-10 rounded-xl border font-semibold text-base transition-all flex items-center justify-center item-size-option ${
                        selectedSize === opt.Variants
                          ? "bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white border-transparent shadow"
                          : "bg-white text-[#00000099] border-[#D0B6E6] border-2"
                      }`}
                      style={{ minWidth: 56 }}
                      onClick={() => {
                        setSelectedSize(opt.Variants);
                        // Advance walkthrough when size is selected
                        if (isWalkthroughActive) {
                          const walkthrough = useWalkthroughStore.getState();
                          const step =
                            walkthrough.steps[walkthrough.currentStep];
                          if (
                            step?.selector ===
                            ".item-details-modal .item-size-options"
                          ) {
                            setTimeout(() => {
                              walkthrough.next();
                            }, 100);
                          }
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span>{opt.Variants}</span>
                        {opt.prices ? (
                          <span className="text-xs text-[#00000066]">
                            (+{opt.prices})
                          </span>
                        ) : null}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="w-full flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white sticky bottom-0 z-20">
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold mb-0.5">
              {t("itemDetails.price")}
            </span>
            <span className="text-xl font-bold text-primary-gradient">
              {item.price} XOF
            </span>
          </div>

          <button
            className={`px-10 py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] shadow hover:opacity-90 transition-all text-lg item-size-add-btn`}
            onClick={() => {
              const chosen =
                sizeOptions.find((s) => s.Variants === selectedSize) ?? null;
              let variantPayload: {
                id?: number | string | null;
                label: string;
                price?: number;
              };
              if (!sizeOptions || sizeOptions.length === 0) {
                // No variants from API — send a sensible fallback: no id, use item's size if available
                const itemRecord = item as unknown as Record<string, unknown>;
                const fallbackLabel =
                  (itemRecord["item-size"] as string | undefined) ??
                  (itemRecord["size"] as string | undefined) ??
                  selectedSize;
                variantPayload = {
                  id: null,
                  label: String(fallbackLabel ?? selectedSize),
                  price: 0,
                };
              } else {
                variantPayload = {
                  id:
                    chosen?.item_map_Variants_id ??
                    chosen?.item_Variants_id ??
                    null,
                  label: selectedSize,
                  price: chosen?.prices,
                };
              }
              console.log(
                "[ItemDetailsModal] onSelect called with variant:",
                variantPayload
              );
              onSelect(variantPayload);
              onClose();
              try {
                const walkthrough = useWalkthroughStore.getState();
                setTimeout(() => {
                  if (walkthrough.isActive) {
                    useWalkthroughStore.getState().next();
                  }
                }, 120);
              } catch (err) {
                void err;
              }
            }}
          >
            {t("itemDetails.addItem")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsModal;
