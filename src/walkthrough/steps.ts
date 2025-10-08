import { type WalkthroughStep } from "@/store/walkthroughStore";

export const trainingSteps: WalkthroughStep[] = [
  // "click to start noting the orders"
  {
    selector: ".quick-order-btn",
    content: "click to start noting the orders",
    page: "/",
    placement: "right",
    align: "start", // Arrow at the top-left corner
    stageRadius: 8,
    stagePadding: 0,
    advanceOn: "ui",

  },
  // "All items of bar & restaurant are here!"
  {
    selector: ".all-items-tab",
    content: "All items of bar & restaurant are here!",
    page: "/orders",
    placement: "bottom",
    align: "start",
    stageRadius: 8,
    stagePadding: 0,
    advanceOn: 'both',
    setCategory: 'all',
  },
  {
    selector: ".burgers-tab",
    content: "Only Main Courses are listed here",
    page: "/orders",
    placement: "bottom",
    align: "start",
    stageRadius: 8,
    stagePadding: 0,
    advanceOn: 'both',
    setCategory: 'Burger',
  },

  // {
  //   selector: ".crispy-tab",
  //   content: "All Crispy items are listed here",
  //   page: "/orders",
  //   placement: "bottom",
  //   align: "start",
  //   stageRadius: 8,
  //   stagePadding: 0,
  //   advanceOn: 'both',
  //   setCategory: 'Crispy',
  // },
  {
    selector: ".nuggets-tab",
    content: "All Nuggets are listed here",
    page: "/orders",
    placement: "bottom",
    align: "start",
    stageRadius: 8,
    stagePadding: 0,
    advanceOn: 'both',
    setCategory: 'Nugget',
  },
  {
    selector: ".beverages-tab",
    content: "All Beverages are listed here",
    page: "/orders",
    placement: "bottom",
    align: "start",
    stageRadius: 8,
    stagePadding: 0,
    advanceOn: 'both',
    setCategory: 'Beverage',
  },
  // "Tap to Select Table & Start Order"
  {
    selector: ".select-table-prompt",
    content: "Tap to Select Table & Start Order",
    page: "/orders",
    placement: "top",
    advanceOn: "both"
  },
  {
    selector: ".person-floor-panel",
    content: "Select number of people & the floor",
    page: "/orders",
    placement: "top",
    advanceOn: "ui"
  },
  {
    selector: ".table-available",
    content: "Select the table based on the availability!",
    page: "/table",
    placement: "top",
    advanceOn: "ui"
  },
  {
    selector: ".order-item-first",
    content: "Select an item from Customers choice",
    page: "/orders",
    placement: "bottom",
    advanceOn: "ui"
  },
  {
    selector: ".order-item-second",
    content: "Add more items by selecting the customers choice",
    page: "/orders",
    placement: "bottom",
    advanceOn: "ui"
  },
  {
    selector: ".order-item-third",
    content: "Add more items by selecting the customers choice",
    page: "/orders",
    placement: "bottom",
    advanceOn: "ui"
  },
  {
    selector: ".order-summary-panel",// this is the order summary panel in right side of the screen
    content: "Check the Order Summary, add items on customer wish",
    page: "/orders",
    placement: "left",
    advanceOn: "description"
  },
  {
    selector: ".select-payment-btn",
    content: "Click here to initiate Payment",
    page: "/orders",
    placement: "bottom",
    advanceOn: "ui"
  },
  {
    selector: ".order-summary-modal", // this is the order summary modal open in the center of the screen when the payment is initiated
    content: "choose payment option",
    page: "/orders",
    placement: "bottom",
    advanceOn: "description"
  },
  {
    selector: ".choose-payment-btn",
    content: "Select the Payment Method",
    page: "/orders",
    placement: "bottom",
    advanceOn: "ui"
  },
  {
    selector: ".ready-to-scan-modal",
    content: "Display this scanner & Wait until they Pay",
    page: "/orders",
    placement: "top",
    advanceOn: "ui"
  },
  {
    selector: ".ready-to-pay-modal",
    content: "Display the Machine & Wait until they Pay",
    page: "/orders",
    placement: "top",
    advanceOn: "ui"
  },
  {
    selector: ".payment-done-modal",
    content: "Acknowledgement once payment done",
    page: "/orders",
    placement: "top",
    advanceOn: "ui"
  },
  {
    selector: ".order-sent-panel",
    content: "Order Created & Start new order",
    page: "/orders",
    placement: "top",
    advanceOn: "ui"
  },

];

export const tableTrainingSteps: WalkthroughStep[] = [  {
    selector: ".table-btn",
    content: "click to Manage Tables and Reservations !",
    page: "/",
    placement: "right",
    align: "start", // Arrow at the top-left corner
    stageRadius: 8,
    stagePadding: 0,
    advanceOn: "ui",
  },
    
  {
    selector: ".table-tab-all",
    content: "All the Tables of your Restaurant are listed here",
    page: "/table",
    placement: "bottom",
    advanceOn: "ui"
  },
  {
    selector: ".table-tab-served",
    content: "All the Tables which were served are listed here",
    page: "/table",
    placement: "bottom",
    advanceOn: "ui"
  },
  {
    selector: ".table-tab-waiting",
    content: "All the Tables which are waiting are listed here",
    page: "/table",
    placement: "bottom",
    advanceOn: "ui"
  },
  {
    selector: ".table-tab-reserved",
    content: "All the Tables which are Reserved are listed here",
    page: "/table",
    placement: "bottom",
    advanceOn: "ui"
  },
];

export const orderHistoryTrainingSteps: WalkthroughStep[] = [
  {
    selector: ".order-history-btn",
    content: "Click to check the Order History !",
    page: "/",
    placement: "right",
    advanceOn: "ui",
  },
  {
    selector: ".order-history-date-filter",
    content: "Click to open the date filter",
    page: "/order-history",
    placement: "bottom",
    advanceOn: "ui",
  },
  {
    selector: ".order-history-date-dropdown",
    content: "Filter helps you to check the history of orders",
    page: "/order-history",
    placement: "bottom",
    advanceOn: "description",
  },
  {
    selector: ".order-history-tab-all",
    content: "Filter helps you to check the status of all orders",
    page: "/order-history",
    placement: "bottom",
    advanceOn: "description",
  },
  {
    selector: ".order-history-tab-served",
    content: "Filter helps you to check the status of all orders",
    page: "/order-history",
    placement: "bottom",
    advanceOn: "description",
  },
  {
    selector: ".order-history-tab-waiting",
    content: "Filter helps you to check the status of all orders",
    page: "/order-history",
    placement: "bottom",
    advanceOn: "description",
  },
  {
    selector: ".order-history-tab-reserved",
    content: "Filter helps you to check the status of all orders",
    page: "/order-history",
    placement: "bottom",
    advanceOn: "description",
  },
];

export const teamChatTrainingSteps: WalkthroughStep[] = [
  {
    selector: ".team-chats-btn",
    content: "Communicate with other employee efficiently !",
    page: "/",
    placement: "right",
    advanceOn: "ui",
  },
  {
    selector: ".team-chat-left-panel",
    content: "Choose any of the chats and interact with the Team",
    page: "/team-chats",
    placement: "bottom",
    advanceOn: "ui",
  },
  {
    selector: ".team-chat-full-panel",
    content: "",
    page: "/team-chats",
    placement: "bottom",
    advanceOn: "ui",
    onAdvance: "autoCloseAndNavigateHome"
  },
];

export const settingsTrainingSteps: WalkthroughStep[] = [
  {
    selector: ".settings-btn",
    content: "Click here to open Settings!",
    page: "/",
    placement: "right",
    advanceOn: "ui",
  },
  {
    selector: ".settings-personal-info",
    content: "View and edit your personal information here.",
    page: "/settings",
    placement: "bottom",
    advanceOn: "description",
  },
  {
    selector: ".profile-highlight",
    content: "View and edit your personal information here.",
    page: "/profile",
    placement: "top",
    advanceOn: "description",
  },
  {
    selector: ".settings-notifications",
    content: "Set your notification preferences.",
    page: "/settings",
    placement: "top",
    advanceOn: "ui",
  },
  {
    selector: ".notifications-highlight",
    content: "View Notifcation  here.",
    page: "/notifications",
    placement: "top",
    advanceOn: "description",
  },
  {
    selector: ".settings-login-security",
    content: "Change your login and security settings.",
    page: "/settings",
    placement: "bottom",
    advanceOn: "ui",
  },
  {
    selector: ".profile-security-tab",
    content: "Click here to view and edit your security settings.",
    page: "/profile",
    placement: "top",
    advanceOn: "description",
  },
  {
    selector: ".settings-work-summary",
    content: "Check your work summary and earnings.",
    page: "/settings",
    placement: "bottom",
    advanceOn: "ui",
  },
  {
    selector: ".profile-work-tab",
    content: "View your work summary and earnings here.",
    page: "/profile",
    placement: "top",
    advanceOn: "description",
  },
  {
    selector: ".settings-clock-in-out",
    content: "Clock in or out for your shift here.",
    page: "/settings",
    placement: "bottom",
    advanceOn: "description",
  },
  {
    selector: ".settings-contact-support",
    content: "Need help? Click here to contact support.",
    page: "/settings",
    placement: "bottom",
    advanceOn: "ui",
  },
  {
    selector: ".contact-support-highlight",
    content: "Here you can contact support and find FAQs.",
    page: "/settings/contact-support",
    placement: "top",
    advanceOn: "description",
  },
];

export const profileTrainingSteps: WalkthroughStep[] = [
  {
    selector: ".profile-btn",
    content: "Click here to open your Profile!",
    page: "/",
    placement: "right",
    advanceOn: "ui",
  },
  {
    selector: ".profile-training-tooltip",
    content: "Your Profile is here !",
    page: "/profile",
    placement: "right",
    advanceOn: "description",
  },
 
  {
    selector: ".profile-work-tab",
    content: "Click here to check your work summary.",
    page: "/profile",
    placement: "top",
    advanceOn: "description",
  },
   {
    selector: ".profile-personal-tab",
    content: "Click to check Your Personal details !",
    page: "/profile",
    placement: "top",
    advanceOn: "description",
  },
    {
    selector: ".profile-security-tab",
    content: " Click to check Your Login Info !",
    page: "/profile",
    placement: "top",
    advanceOn: "description",
  },
    {
    selector: ".profile-sign-out-tab",
    content: "Click here to Sign out !",
    page: "/profile",
    placement: "top",
    advanceOn: "description",
  },
 
];