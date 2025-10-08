/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useMenuStore } from "@/store/zustandStores";
import { useOrderFlowStore } from "@/store/zustandStores";
import { useNavigate, useLocation } from "react-router-dom";
import ItemDetailsModal from "@/components/common/ItemDetailsModal";
import AddonsModal from "@/components/common/AddonsModal";
import personIcon from "@/assets/user_icon.svg";
import floorIcon from "@/assets/floor_icon.svg";
import tableIcon from "@/assets/table_filled_icon.svg";
import TrashIcon from "@/assets/Trash.svg";
import { SuccessModal } from "@/components/common/SuccessModal";
import successIcon from '@/assets/order/success_icon_large.svg'
import { createOrder, updateOrder } from '@/api/orderApi';
import type { OrderStatus, OrderType, PaymentMethod, PaymentStatus } from '@/types/order';
import OrderSummaryModal from '@/components/common/OrderSummaryModal';
import PaymentModal from '@/components/common/PaymentModal';
import { useWalkthroughStore } from '@/store/walkthroughStore';
import { useWalkthroughUIStore } from '@/store/zustandStores';
import ReadyToScanModal from '@/components/common/ReadyToScanModal';
import ReadyToPayModal from '@/components/common/ReadyToPayModal';
import PaymentDoneModal from '@/components/common/PaymentDoneModal';
import { tableTrainingSteps } from '@/walkthrough/steps';

const categories = [
  { label: "All Items", value: "all" },
  { label: "Burgers", value: "Burger", icon: "🍔" },
  { label: "Beverages", value: "Beverage", icon: "🥤" },
  { label: "Crispy", value: "Crispy", icon: "🍗" },
  { label: "Nuggets", value: "Nugget", icon: "🍖" },
];

const floors = ["F-01", "F-02", "F-03", "F-04", "F-05", "F-06"];

const Orders: React.FC = () => {
  const { menuItems, fetchMenuItems, loading } = useMenuStore();
  const {
    currentOrder,
    pendingItem,
    pendingCustomizedItem,
    setPendingCustomizedItem,
    clearPendingCustomizedItem,
    addItemToOrder,
    resetOrder,
    startOrder,
    updateOrderItem,
    setCurrentOrderId,
    removeOrderItem,
    setFloor,
    setPersons: setPersonsGlobal,
    setInOrderFlow,
  } = useOrderFlowStore();
  const [feedback, setFeedback] = useState("");
  const [showItemDetailsModal, setShowItemDetailsModal] = useState(false);
  const [showAddonsModal, setShowAddonsModal] = useState(false);
  const [modalItem, setModalItem] = useState(null as any);
  const [modalSize, setModalSize] = useState("M");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showOrderSentPanel, setShowOrderSentPanel] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Table selection state
  const [persons, setPersons] = useState(1);
  const [selectedFloor, setSelectedFloor] = useState("F-01");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [showFloorPersonsPanel, setShowFloorPersonsPanel] = useState(false);

  const [orderSending, setOrderSending] = useState(false);

  const [showSummaryPanel, setShowSummaryPanel] = useState(false);

  const [showOrderSummaryModal, setShowOrderSummaryModal] = useState(false);
  // const [showPaymentDone, setShowPaymentDone] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const selectedCategory = useWalkthroughUIStore((s) => s.selectedCategory);
  const setSelectedCategory = useWalkthroughUIStore((s) => s.setSelectedCategory);

  const { steps, currentStep, isActive, next } = useWalkthroughStore();
  const [orderSummaryClickable, setOrderSummaryClickable] = useState(true);

  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showReadyToScan, setShowReadyToScan] = useState(false);
  const [showReadyToPay, setShowReadyToPay] = useState(false);

  console.log("[Orders render]", {
    selectedTable,
    currentOrder,
    pendingCustomizedItem,
    showOrderSentPanel,
    showConfirmationModal,
    showFloorPersonsPanel,
  });

  // Force enable order summary button during walkthrough
  useEffect(() => {
    if (isActive && steps[currentStep]?.selector === ".select-payment-btn") {
      setOrderSummaryClickable(true);
    }
  }, [isActive, steps, currentStep]);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  // Set that we're in order flow when this component mounts
  useEffect(() => {
    setInOrderFlow(true);
  }, [setInOrderFlow]);

  // If a pendingItem exists and currentOrder just became available, open modals for it
  useEffect(() => {
    if (pendingItem && currentOrder) {
      setModalItem(pendingItem);
      setShowItemDetailsModal(true);
    }
  }, [pendingItem, currentOrder]);

  // If a pendingCustomizedItem exists and a table is selected, add it to the order
  useEffect(() => {
    if (pendingCustomizedItem && selectedTable && currentOrder) {
      addItemToOrder(pendingCustomizedItem);
      clearPendingCustomizedItem();
    }
    // eslint-disable-next-line
  }, [pendingCustomizedItem, selectedTable, currentOrder]);

  // If a pending customized item exists and table is selected, start the order automatically (item-first flow)
  useEffect(() => {
    if (pendingCustomizedItem && selectedTable && !currentOrder) {
      console.log("[Effect] Auto-start order (item-first flow)", {
        pendingCustomizedItem,
        selectedTable,
        currentOrder,
      });
      startOrder({ tableId: selectedTable, floor: selectedFloor, persons });
    }
    // eslint-disable-next-line
  }, [
    pendingCustomizedItem,
    selectedTable,
    currentOrder,
    selectedFloor,
    persons,
  ]);

  // Sync local state with currentOrder from store
  useEffect(() => {
    if (currentOrder && currentOrder.tableId) {
      setSelectedTable(currentOrder.tableId);
      setSelectedFloor(currentOrder.floor);
      setPersons(currentOrder.persons);
    }
  }, [currentOrder]);



  useEffect(() => {
    if (location.state && location.state.showOrderSentPanel) {
      setShowOrderSentPanel(true);
      // Optionally clear the state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.itemType === selectedCategory);

  // Dummy: Assume all items have size options
  const itemHasSize = () => true;

  // Handle right panel click (table-first flow)
  const handleRightPanelClick = () => {
      setShowFloorPersonsPanel(true);
    // Advance walkthrough if on the correct step
    const walkthrough = useWalkthroughStore.getState();
    const step = walkthrough.steps[walkthrough.currentStep];
    if (step?.selector === ".select-table-prompt" && (!step.advanceOn || step.advanceOn === "both" || step.advanceOn === "ui")) {
      walkthrough.next();
    }
  };

  // Handle item click (item-first flow)
  const handleAddToCart = (item: (typeof menuItems)[0]) => {
    if (!currentOrder && !selectedTable && !showFloorPersonsPanel) {
      // Wait for panel to open, then open modal
      setTimeout(() => {
        setModalItem(item);
        if (itemHasSize()) {
          setShowItemDetailsModal(true);
        } else {
          setShowAddonsModal(true);
        }
        setShowFloorPersonsPanel(true);
      }, 100);
      return;
    }
    setModalItem(item);
    if (itemHasSize()) {
      setShowItemDetailsModal(true);
    } else {
      setShowAddonsModal(true);
    }
  };

  // Handle AddonsModal save
  const handleAddonsSave = ({
    addons,
    note,
  }: {
    addons: string[];
    note: string;
  }) => {
    if (!modalItem) return;
    // Find the add-on price from dummyAddons (or your real add-ons source)
    const dummyAddons = [
      { label: "No Ice", price: 0 },
      { label: "Less Sugar", price: 0 },
      { label: "No Sugar", price: 0 },
      { label: "Extra Cream", price: 20 },
      { label: "Extra Toppings", price: 20 },
      { label: "Extra Thick", price: 20 },
    ];
    const customizedItem = {
      ...modalItem,
      size: modalSize,
      addOns: addons.map((label, idx) => {
        const found = dummyAddons.find(a => a.label === label);
        return {
          id: String(idx),
          name: label,
          price: found ? found.price : 0,
        };
      }),
      notes: note,
    };
    if (!currentOrder && !selectedTable) {
      setPendingCustomizedItem(customizedItem);
      setShowAddonsModal(false);
      // Show table selection UI in right panel
      setModalItem(null);
      setModalSize("M");
      return;
    }
    addItemToOrder(customizedItem);
    setFeedback(`${modalItem.name} added to order!`);
    setTimeout(() => setFeedback(""), 1200);
    setShowAddonsModal(false);
    setModalItem(null);
    setModalSize("M");
  };

  // Order summary helpers
  const orderItems = currentOrder?.items || [];
  const subtotal = orderItems.reduce((sum, item) => {
    const addOnsTotal =
      (item.addOns?.reduce((a, addon) => a + (addon.price || 0), 0) || 0) *
      (item.quantity || 1);
    return sum + item.price * (item.quantity || 1) + addOnsTotal;
  }, 0);
  const tax = Math.round(subtotal * 0.06);
  const total = subtotal + tax;
  const hasKitchenItem = orderItems.some(
    (item) => item.preparationStation === "Kitchen"
  );
  const allCounter =
    orderItems.length > 0 &&
    orderItems.every((item) => item.preparationStation === "Counter");

  // Handle order action
  const handleOrderAction = async () => {
    if (hasKitchenItem) {
      setShowConfirmationModal(true);
    } else if (allCounter) {
      // Payment modal placeholder
      setTimeout(() => setShowOrderSentPanel(true), 800);
    }
  };

  // Confirm order and call API
  const handleConfirmationContinue = async () => {
    if (!currentOrder) return;
    setOrderSending(true);
    try {
      // Build order payload (add more fields as needed)
      const now = new Date().toISOString();
      const orderPayload = {
        orderId: Date.now().toString(),
        status: 'Pending' as OrderStatus,
        orderType: 'Dine-In' as OrderType,
        tableInfo: { tableId: currentOrder.tableId, floor: currentOrder.floor, status: 'Occupied' },
        waiterName: 'John Doe', // Replace with actual user if available
        pricingSummary: {
          subtotal,
          tax,
          discount: 0,
          serviceCharge: 0,
          totalAmount: total,
        },
        paymentDetails: {
          method: 'Cash' as PaymentMethod,
          status: 'Unpaid' as PaymentStatus,
        },
        items: currentOrder.items,
        createdAt: now,
        updatedAt: now,
        statusHistory: [{ status: 'Pending' as OrderStatus, at: now }],
      };
      const result = await createOrder(orderPayload);
      if (result && result.order && result.order.orderId) {
        setCurrentOrderId(result.order.orderId);
      }
      setShowConfirmationModal(false);
      setShowOrderSentPanel(true);
    } catch {
      console.warn('Failed to send order.');
    } finally {
      setOrderSending(false);
    }
  };

  // Handle next order
  const handleNextOrder = () => {
    resetOrder();
    setShowOrderSentPanel(false);
    setSelectedTable(null);
    setPersons(1);
    setSelectedFloor("F-01");
    const walkthrough = useWalkthroughStore.getState();
    walkthrough.complete();
    // Do NOT start the next training here!
  };

  // Table selection UI logic
  const handleSelectTable = () => {
    navigate("/table", { state: { persons, floor: selectedFloor } });

    // Advance walkthrough if on the correct step
    const walkthrough = useWalkthroughStore.getState();
    const step = walkthrough.steps[walkthrough.currentStep];
    if (step?.selector === ".select-table" && (!step.advanceOn || step.advanceOn === "both" || step.advanceOn === "ui")) {
      walkthrough.next();
    }
  };

  // After table selection, reset showFloorPersonsPanel for next order
  useEffect(() => {
    if (selectedTable && showFloorPersonsPanel) {
      setShowFloorPersonsPanel(false);
    }
  }, [selectedTable, showFloorPersonsPanel]);

  const handleDeleteItem = (itemId: string) => {
    if (!currentOrder) return;
    removeOrderItem(itemId);
  };

  // Toggle allergy for an item
  const handleToggleAllergy = (itemId: string) => {
    if (!currentOrder) return;
    const item = currentOrder.items.find((i) => i.itemId === itemId);
    if (!item) return;
    updateOrderItem(itemId, { allergy: !item.allergy });
  };

  // Expose for walkthrough controller
  (window as any).handleSelectTable = handleSelectTable;
  (window as any).handleRightPanelClick = handleRightPanelClick;

  useEffect(() => {
    const walkthrough = useWalkthroughStore.getState();
    const step = walkthrough.steps[walkthrough.currentStep];
    if (
      walkthrough.isActive &&
      step?.selector === ".order-item-first" &&
      filteredItems.length > 0 &&
      document.querySelector(".order-item-first")
    ) {
      // No-op: the controller will now show the step because the element is present
      // Optionally, you could force a re-render or call walkthrough.next() if needed
    }
  }, [filteredItems]);

  useEffect(() => {
    // Only disable click if walkthrough is active and on the order summary step
    const step = steps[currentStep];
    if (isActive && step && step.selector === '.order-summary-panel') {
      setOrderSummaryClickable(false);
    } else {
      setOrderSummaryClickable(true);
    }
  }, [steps, currentStep, isActive]);



  useEffect(() => {
    if (showReadyToScan) {
      const t = setTimeout(() => {
        setShowReadyToScan(false);
        setShowReadyToPay(true);
        next(); // Advance walkthrough to .ready-to-pay-modal
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [showReadyToScan]);

  useEffect(() => {
    if (showReadyToPay) {
      const t = setTimeout(() => {
        setShowReadyToPay(false);
        // setShowPaymentDone(true);
        next(); // Advance walkthrough to .payment-done-modal
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [showReadyToPay]);

  // PaymentDoneModal close handler
  const handlePaymentDoneClose = () => {
    // setShowPaymentDone(false);
    setShowPaymentOptions(false); // Close payment options modal
    setShowOrderSentPanel(true);  // Show next order UI in right panel
    next();
    navigate('/orders');
  };

  const step = steps[currentStep];

  const { completed, activeTraining, startTraining, reset } = useWalkthroughStore();
  useEffect(() => {
    if (completed && activeTraining === "order") {
      reset(); // Fully clear the previous training state
      setTimeout(() => {
        startTraining("table", tableTrainingSteps);
        navigate("/"); // Ensure we go to home, not /table
      }, 50); // Small delay to ensure state is flushed
    }
  }, [completed, activeTraining, startTraining, reset, navigate]);

  return (
    <div className="flex flex-col   mb-20 py-4  sm:p-8  bg-[#fafafa] max-w-screen">
      <h1 className="text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-4">
        Quick Orders
      </h1>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 h-auto lg:h-[70vh] items-stretch">
        {/* Left: Menu Items Grid */}
        <div className="flex-1 bg-white rounded-3xl shadow-lg p-3 sm:p-6 overflow-y-auto relative">
          {/* Category Filter Bar */}
          <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-scroll bg-[#F1F1F1] rounded-full p-1">
            {categories.map((cat) => (
                <button
                  key={cat.value}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full font-medium transition-all ${
                    selectedCategory === cat.value
                      ? "bg-white shadow text-black"
                      : "bg-transparent text-gray-500 hover:bg-gray-100"
                  }
                  ${cat.value === "all" ? "all-items-tab" : ""}
                  ${cat.value === "Burger" ? "burgers-tab" : ""}
                  ${cat.value === "Beverage" ? "beverages-tab" : ""}
                  ${cat.value === "Crispy" ? "crispy-tab" : ""}
                  ${cat.value === "Nugget" ? "nuggets-tab" : ""}
                  `}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    const walkthrough = useWalkthroughStore.getState();
                    const step = walkthrough.steps[walkthrough.currentStep];
                    if (!step?.advanceOn || step.advanceOn === 'both' || step.advanceOn === 'ui') {
                      setTimeout(() => {
                        walkthrough.next();
                      }, 100);
                    }
                  }}
                >
                  {cat.icon && <span className="text-xl">{cat.icon}</span>}
                  {cat.label}
                </button>
            ))}
          </div>
          {/* Items Grid */}
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 ">
              {filteredItems.length === 0 ? (
                <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 text-center text-gray-400">
                  No items found.
                </div>
              ) : (
                filteredItems.map((item, idx) => (
                  <div
                    key={item.itemId + idx}
                    className={`w-[125px] min-h-[140px] bg-white rounded-xl shadow-[0_0_10px_2px_rgba(0,0,0,0.1)] flex flex-col items-center justify-between p-2 cursor-pointer border border-gray-100 group min-w-[125px] mx-auto${idx === 0 ? ' order-item-first' : ''}${idx === 1 ? ' order-item-second' : ''}${idx === 2 ? ' order-item-third' : ''}`}
                    onClick={() => {
                      // If walkthrough is active and on the correct step, bypass modals
                      const walkthrough = useWalkthroughStore.getState();
                      const step = walkthrough.steps[walkthrough.currentStep];
                      if (
                        walkthrough.isActive &&
                        (step?.selector === ".order-item-first" || step?.selector === ".order-item-second" || step?.selector === ".order-item-third")
                      ) {
                        addItemToOrder({ ...item, quantity: 1 });
                        walkthrough.next();
                        return;
                      }
                      handleAddToCart(item);
                    }}
                  >
                    <img
                      src={
                        item.image ||
                        "https://via.placeholder.com/81x67?text=Item"
                      }
                      alt={item.name}
                      className="w-[81px] h-[67px] object-contain mt-2"
                    />
                    <div className="text-[14px] font-medium text-center mt-2 line-clamp-2">
                      {item.name}
                    </div>
                    <div className="text-[12px] font-semibold text-black mt-1">
                      {item.price} XOF
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {feedback && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 rounded-full shadow-lg z-50 transition-all animate-bounce">
              {feedback}
            </div>
          )}
          {showOrderSentPanel && (
            <div
              className="absolute inset-0 z-30 flex items-center justify-center   bg-[rgba(0,0,0,0)] 
              bg-opacity-30"
              // backdrop-blur-xs
              style={{ pointerEvents: 'auto' }}
            >
              {/* <div className="bg-white rounded-xl shadow-lg px-8 py-6 text-lg font-semibold text-center">
                Click on <span className="text-primary font-bold">Next Order</span> to continue
              </div> */}
            </div>
          )}
        </div>
        {/* Right: Table/Order Panel */}
        <div
          className="w-full  lg:w-96 bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center text-center  min-h-[300px] sm:min-h-[400px] overflow-y-auto mt-4 lg:mt-0"
          onClick={handleRightPanelClick}
          style={{
            cursor:
              !currentOrder &&
              !selectedTable &&
              !showFloorPersonsPanel &&
              !showOrderSentPanel &&
              !showConfirmationModal
                ? "pointer"
                : "default",
          }}
        >
          {/* Order Sent Panel */}
          {showOrderSentPanel && (
              <div className="w-full h-full flex flex-col justify-between overflow-scroll order-sent-panel">
              <div className="bg-[#EDEDED] rounded-t-2xl p-4 w-full text-left">
                <div className="text-lg font-bold">#{currentOrder ? (currentOrder as any).orderId ||( Math.random()*1000).toFixed(0) : (Math.random()*1000).toFixed(0)}</div>
                <div className="flex justify-between">

                <div className="text-xs font-semibold">Order Created</div>
                <div className="text-xs font-semibold text-right">
                  Table - {currentOrder?.tableId.replace("t-", "")}
                </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full p-6 mb-4">
                  <img src={successIcon} alt="success" />
                </div>
              </div>
              <button
                className="w-full py-3 rounded-b-2xl text-lg font-semibold text-white bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] shadow-md hover:opacity-90 transition-all"
                onClick={handleNextOrder}
              >
                Next Order
              </button>
            </div>
          )}
          {/* Confirmation Modal */}
          <SuccessModal
            open={showConfirmationModal}
            title="Order Sent to Kitchen"
            subtitle="Your Dish has been created and will be updated in the menu in couple of minutes"
            buttonText={orderSending ? "Sending..." : "Continue"}
            onButtonClick={handleConfirmationContinue}
            
          />
          {/* Floor/persons selection UI (if no table selected and showFloorPersonsPanel) */}
          {!selectedTable &&
            !currentOrder &&
            showFloorPersonsPanel &&
            !showOrderSentPanel &&
            !showConfirmationModal && (
              <div className="w-full h-full flex flex-col justify-between overflow-scroll person-floor-panel">
                <div
                  className="rounded-t-2xl p-4 text-black text-left"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(106, 27, 154, 0.5) 0%, rgba(211, 47, 47, 0.5) 100%)",
                  }}
                >
                  <div className="text-lg font-bold">Floor Map</div>
                  <div className="text-xs font-normal">
                    Select Floor and Persons
                  </div>
                </div>
                <div className="">
                  <div className="p-6">
                    <div className="font-semibold mb-6 text-start">Select Persons:</div>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="w-10 h-10 rounded-l-lg bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white text-2xl flex items-center justify-center"
                        onClick={() => {
                          setPersons((p) => {
                            const newVal = Math.max(1, p - 1);
                            setPersonsGlobal(newVal);
                            return newVal;
                          });
                        }}
                      >
                        –
                      </button>
                      <div className="w-16 h-10 flex items-center justify-center border-t border-b border-gray-200 text-lg font-bold">
                        {persons}
                      </div>
                      <button
                        className="w-10 h-10 rounded-r-lg bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white text-2xl flex items-center justify-center"
                        onClick={() => {
                          setPersons((p) => {
                            const newVal = Math.min(20, p + 1);
                            setPersonsGlobal(newVal);
                            return newVal;
                          });
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="mb-6 p-6 ">
                    <div className="font-semibold mb-6 text-start">Select Floor:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      {floors.map((floor) => (
                        <button
                          key={floor}
                          className={`py-2 sm:py-3 rounded-lg text-base font-medium shadow-sm transition-all  ${
                            selectedFloor === floor
                              ? "bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white"
                              : "bg-[#f7f2fa]"}`}
                          onClick={() => {
                            setSelectedFloor(floor);
                            setFloor(floor);
                          }}
                        >
                          {floor}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    className="select-table-panel w-full py-3 mt-2 rounded-b-lg text-lg font-semibold text-white bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] shadow-md hover:opacity-90 transition-all"
                    onClick={() => {
                      // Advance walkthrough to the next step before navigating
                      const walkthrough = useWalkthroughStore.getState();
                      const step = walkthrough.steps[walkthrough.currentStep];
                      if (step?.selector === ".person-floor-panel" && (!step.advanceOn || step.advanceOn === "both" || step.advanceOn === "ui")) {
                        walkthrough.next();
                      }
                      // Now navigate to /table
                      handleSelectTable();
                    }}
                  >
                    Select Table
                  </button>
                </div>
              </div>
            )}
          {/* Initial State: Prompt to select table (only if not showing selection UI) */}
          {!selectedTable &&
            !currentOrder &&
            !showOrderSentPanel &&
            !showConfirmationModal &&
            !showFloorPersonsPanel && (
              <div className="flex flex-col items-center justify-center h-full w-full select-table-prompt" onClick={handleRightPanelClick}>
                <div className="text-2xl font-bold text-[#00000099] mb-2">
                  Tap to Select Table
                </div>
                <div className="text-2xl font-bold text-[#00000099] mb-2">
                  &amp;
                  <br />
                  Start Order
                </div>
              </div>
            )}
          {/* Table selected, but order not started (table-first flow) */}
          {selectedTable &&
            !currentOrder &&
            !pendingCustomizedItem &&
            !showOrderSentPanel &&
            !showConfirmationModal &&
            (console.log("[Render] Start Order panel"),
            (
              <div className="w-full h-full flex flex-col justify-between overflow-scroll">
                <div
                  className="rounded-t-2xl p-4 text-black text-left"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(106, 27, 154, 0.5) 0%, rgba(211, 47, 47, 0.5) 100%)",
                  }}
                >
                  <div className="text-2xl font-bold">Start Order</div>
                  <div className="text-xs font-normal">
                    Floor, Table, Person Display
                  </div>
                </div>
                <div className="flex flex-col items-center justify-between gap-4 py-8 px-4">
                  <div className="flex w-1/2 gap-2 text-lg">
                    <img src={personIcon} alt="person icon" />
                    Persons:{" "}
                    <span className="font-bold">
                      {persons.toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex w-1/2 gap-2 text-lg">
                    <img src={floorIcon} alt="floor icon" />
                    Floor:{" "}
                    <span className="font-bold">{(selectedFloor ?? "F-01").replace("F-", "")}</span>
                  </div>
                  <div className="flex w-1/2 gap-2 text-lg">
                    <img src={tableIcon} alt="table icon" />
                    Table:{" "}
                    <span className="font-bold">{(selectedTable ?? "").replace("t-", "")}</span>
                  </div>
                </div>
                <button
                  className="w-full py-3 rounded-b-2xl text-lg font-semibold text-white bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] shadow-md hover:opacity-90 transition-all"
                  onClick={() => {
                    console.log("[Button] Start Order clicked", {
                      selectedTable,
                      selectedFloor,
                      persons,
                    });
                    startOrder({
                      tableId: selectedTable,
                      floor: selectedFloor,
                      persons,
                    });
                  }}
                >
                  Start Order
                </button>
              </div>
            ))}
          {/* Order Summary Panel (shown after order is started and has items, or if showSummaryPanel is true) */}
          {(currentOrder && ((currentOrder.items && currentOrder.items.length > 0) || showSummaryPanel) && !showOrderSentPanel && !showConfirmationModal) && (
            <div className="order-summary-panel w-full h-full flex flex-col justify-between overflow-scroll" style={{ pointerEvents: orderSummaryClickable ? 'auto' : 'none', opacity: orderSummaryClickable ? 1 : 0.6 }}>
              <div
                className="rounded-t-2xl py-4 px-7  text-black text-left"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(106, 27, 154, 0.5) 0%, rgba(211, 47, 47, 0.5) 100%)",
                }}
              >
                <div className="text-2xl font-bold">Order Summary</div>
                <div className="text-base font-medium ">
                  Table - {currentOrder.tableId.replace("t-", "")}
                </div>
              </div>
              <div className="flex flex-col gap-2 py-4 px-4 flex-1 overflow-y-auto">
                <div className="flex font-medium text-base  border-b border-black pb-2">
                  <div className="w-12">Qty</div>
                  <div className="flex-1">Item</div>
                  <div className="w-20">Size</div>
                  <div className="w-20 text-right">Total</div>
                </div>
                {orderItems.map((item, idx) => (
                  <div
                    key={item.itemId + idx}
                    className="flex justify-between text-base border-b border-gray-100  group"
                  >
                    <div className="w-12  ">
                      {item.quantity || 1} x{item.size || "L"}
                    </div>
                    <div className="flex-1 flex flex-col items-start">
                      <span className="font-semibold text-sm">{item.name}</span>

                      {item.addOns && item.addOns.length > 0 && (
                        <>
                          <div className="text-[10px] text-[#00000099] text-wrap text-start">
                            {item.addOns.map((a) => a.name).join(", ")}
                          </div>
                          {/* Show add-on total price if any */}
                          {(() => {
                            const addOnTotal = item.addOns.reduce((sum, a) => sum + (a.price || 0), 0) * (item.quantity || 1);
                            return addOnTotal > 0 ? (
                              <div className="text-[10px] text-[#D32F2F] font-semibold mt-0.5">+{addOnTotal} XOF</div>
                            ) : null;
                          })()}
                        </>
                      )}
                      {item.notes && (
                        <div className="text-[10px] text-[#00000099] text-wrap text-start">
                          {item.notes}
                        </div>
                      )}
                    </div>
                    <div className="w-20 text-right font-bold ">
                    <button
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all mb-1 ${
                          item.allergy
                            ? "bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white shadow"
                            : "bg-[#F6E6F8] text-[#303030] border border-[#E0E0E0]"
                        }`}
                        onClick={() => handleToggleAllergy(item.itemId)}
                      >
                        Allergy
                      </button>
                    </div>
                    <div className="flex flex-col justify-between items-end h-full ml-auto" style={{ minHeight: 60 }}>
                      <div className="w-20 text-right text-[10px] font-semibold mb-auto">
                      {item.price} XOF
                      </div>
                      <button
                        className="w-8 h-8 flex items-baseline justify-end mt-auto opacity-80 hover:opacity-100"
                        onClick={() => handleDeleteItem(item.itemId)}
                        aria-label="Delete item"
                      >
                        <img src={TrashIcon} alt="Delete" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-gray-300 "></div>
              <div
                className=" p-4"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(106, 27, 154, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)",
                }}
              >
                <div className="flex text-xs justify-between text-[#5A5A5A] mb-1">
                  <span>Tax 6%</span>
                  <span>{tax.toLocaleString()} XOF</span>
                </div>
                <div className="flex justify-between font-bold text-xl text-[#303030]">
                  <span>
                    Subtotal{" "}
                    <span className="font-normal text-sm">(Incl. tax)</span>
                  </span>
                  <span className="text-[#303030] font-medium">
                    {total.toLocaleString()} XOF
                  </span>
                </div>
              </div>

              {orderItems.length > 0 &&
                orderItems.some((item) => item.itemType !== "Beverage") && (
                  <button
                    className="w-full py-2 text-lg font-semibold bg-green-500 text-white  shadow hover:opacity-90 transition-all"
                    onClick={handleOrderAction}
                  >
                    Send to Kitchen
                  </button>
                )}
              {orderItems.length > 0 && (
                <button
                  className="select-payment-btn w-full py-3 text-lg font-bold bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white rounded-b-2xl rounded-t-none shadow hover:opacity-90 transition-all "
                  onClick={() => {
                    setShowOrderSummaryModal(true);
                    // Advance walkthrough if on the correct step
                    const walkthrough = useWalkthroughStore.getState();
                    const step = walkthrough.steps[walkthrough.currentStep];
                    if (step?.selector === ".select-payment-btn" && (!step.advanceOn || step.advanceOn === "both" || step.advanceOn === "ui")) {
                      walkthrough.next();
                    }
                  }}
                  disabled={!orderSummaryClickable}
                  style={{ pointerEvents: orderSummaryClickable ? 'auto' : 'none', opacity: orderSummaryClickable ? 1 : 0.6 }}
                >
                  Select Payment Option
                </button>
              )}
            </div>
          )}
          {/* Start Order Panel (shown after table selection, before adding items) */}
          {currentOrder && currentOrder.items && currentOrder.items.length === 0 && !showOrderSentPanel && !showConfirmationModal && !showSummaryPanel && (
            <div className="w-full h-full flex flex-col justify-between overflow-scroll">
              <div
                className="rounded-t-2xl p-4 text-black text-left"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(106, 27, 154, 0.5) 0%, rgba(211, 47, 47, 0.5) 100%)",
                }}
              >
                <div className="text-2xl font-bold">Start Order</div>
                <div className="text-xs font-normal">
                  Floor, Table, Person Display
                </div>
              </div>
              <div className="flex flex-col items-center justify-between gap-4 py-8 px-4">
                <div className="flex w-1/2 gap-2 text-lg">
                  <img src={personIcon} alt="person icon" />
                  Persons: <span className="font-bold">{persons.toString().padStart(2, "0")}</span>
                </div>
                <div className="flex w-1/2 gap-2 text-lg">
                  <img src={floorIcon} alt="floor icon" />
                  Floor: <span className="font-bold">{(selectedFloor ?? "F-01").replace("F-", "")}</span>
                </div>
                <div className="flex w-1/2 gap-2 text-lg">
                  <img src={tableIcon} alt="table icon" />
                  Table: <span className="font-bold">{(selectedTable ?? "").replace("t-", "")}</span>
                </div>
              </div>
              <button
                className="w-full py-3 rounded-b-2xl text-lg font-semibold text-white bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] shadow-md hover:opacity-90 transition-all"
                onClick={() => {
                  setShowSummaryPanel(true);
                }}
              >
                Start Order
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Item Details Modal */}
      <ItemDetailsModal
        open={showItemDetailsModal}
        item={modalItem}
        onClose={() => setShowItemDetailsModal(false)}
        onSelect={(size) => {
          setModalSize(size);
          setShowItemDetailsModal(false);
          setTimeout(() => setShowAddonsModal(true), 100);
        }}
      />
      {/* Addons Modal */}
      <AddonsModal
        open={showAddonsModal}
        item={modalItem}
        selectedSize={modalSize}
        tableId={currentOrder?.tableId}
        onClose={() => setShowAddonsModal(false)}
        onSave={handleAddonsSave}
      />
      <OrderSummaryModal
        open={showOrderSummaryModal}
        onClose={() => setShowOrderSummaryModal(false)}
        order={{
          items: orderItems,
          subtotal,
          tax,
          total,
          orderId: (currentOrder as any)?.orderId,
          paymentType: '',
          customerName: '',
        }}
        onUpdateItemQuantity={(itemId, newQty) => {
          updateOrderItem(itemId, { quantity: newQty });
        }}
        onChoosePaymentOption={() => {
          setShowOrderSummaryModal(false);
          setTimeout(() => setShowPaymentOptions(true), 200);
        }}
      />
      {/* Payment Flow Modals */}
      {showPaymentOptions && (
      <PaymentModal
          open={showPaymentOptions}
          onClose={() => setShowPaymentOptions(false)}
        total={total}
        onConfirm={async (method) => {
            if(isActive) return
          const orderId = (currentOrder && (currentOrder as any).orderId) || `${currentOrder?.tableId}-${currentOrder?.floor}-${currentOrder?.persons}`;
          if (currentOrder && orderId) {
            await updateOrder(orderId, {
              paymentDetails: {
                method,
                status: 'Paid',
              },
            });
            // Send order to kitchen
            const subtotal = currentOrder.items.reduce((sum, item) => {
              const addOnsTotal =
                (item.addOns?.reduce((a, addon) => a + (addon.price || 0), 0) || 0) *
                (item.quantity || 1);
              return sum + item.price * (item.quantity || 1) + addOnsTotal;
            }, 0);
            const tax = Math.round(subtotal * 0.06);
            const total = subtotal + tax;
            const now = new Date().toISOString();
            await createOrder({
              orderId,
              status: 'Pending',
              orderType: 'Dine-In',
              tableInfo: { tableId: currentOrder.tableId, floor: currentOrder.floor, status: 'Occupied' },
              waiterName: 'John Doe',
              pricingSummary: {
                subtotal,
                tax,
                discount: 0,
                serviceCharge: 0,
                totalAmount: total,
              },
              paymentDetails: {
                method,
                status: 'Paid',
              },
              items: currentOrder.items,
              createdAt: now,
              updatedAt: now,
              statusHistory: [{ status: 'Pending' as OrderStatus, at: now }],
            });
            setShowPaymentOptions(false);
            setShowSuccessModal(true);
          }
        }}
      />
      )}

      {isActive && step?.selector === '.ready-to-scan-modal' && (
        <ReadyToScanModal onClose={() => setTimeout(next, 2000)} />
      )}
      {isActive && step?.selector === '.ready-to-pay-modal' && (
        <ReadyToPayModal onClose={() => setTimeout(next, 2000)} />
      )}
      {isActive && step?.selector === '.payment-done-modal' && (
        <PaymentDoneModal onClose={handlePaymentDoneClose} />
      )}
      <SuccessModal
        open={showSuccessModal}
        title="Payment Received Successful !"
        subtitle="Your payment has been processed and the order has been updated."
        buttonText="Start new Order"
        onButtonClick={() => {
          setShowSuccessModal(false);
          resetOrder();
          const newOrderId = Date.now().toString();
          startOrder({ tableId: '', floor: '', persons: 1, orderId: newOrderId });
          navigate('/orders', { state: { showOrderSentPanel: true } });
        }}
      />
    </div>
  );
};

export default Orders;
