import "react-i18next";

declare module "react-i18next" {
  interface Resources {
    common: {
      leftPanel: {
        heading: string;
        subheading: string;
      };
      sidebar: {
        nav: {
          quickOrder: string;
          table: string;
          orderHistory: string;
        };
        training: {
          title: string;
          training: string;
          teamChats: string;
        };
        bottom: {
          setting: string;
          signOut: string;
        };
        user: {
          defaultName: string;
          defaultRole: string;
        };
        toast: {
          loggedOut: string;
        };
      };
      profile: {
        personal: string;
      };
      notifications: {
        title: string;
        loading: string;
        today: string;
        yesterday: string;
        daysAgo: string;
        aWeekAgo: string;
        aMonthAgo: string;
        defaultTitle: string;
      };
      employees: {
        title: string;
      };
      chats: {
        title: string;
        teamTitle: string;
        roles: {
          all: string;
          waiters: string;
          chefs: string;
          managers: string;
        };
        searchPlaceholder: string;
        loadingChats: string;
        errorLoadingChats: string;
        noChatsYet: string;
        noChatsFound: string;
        noChatsMatchSearch: string;
        unknown: string;
        noMessagesYet: string;
        startTyping: string;
        send: string;
        members: string;
        viewMembers: string;
        teamMembers: string;
        userWithId: string;
        teamMemberRole: string;
        lastSeen: string;
        empty: {
          title: string;
          subtitle: string;
        };
      };
      dashboard: {
        welcome: string;
      };
      orders: {
        title: string;
        noItems: string;
        categories: {
          allItems: string;
        };
        orderSent: {
          title: string;
          created?: string;
          subtitle?: string;
        };
        orderSummary: {
          title: string;
          check: string;
          printBill: string;
          choosePayment: string;
          paymentSuccess: string;
          paymentDoneText: string;
          totalPayment: string;
          orderNumber: string;
          dateTime: string;
          paymentType: string;
          customerName: string;
          printReceipt: string;
          backToSummary: string;
          headers: {
            qty: string;
            item: string;
            size: string;
            total: string;
          };
          taxLabel: string;
          subtotal: string;
        };
        allergy: string;
        addedToOrder: string;
        nextOrder: string;
        tapToSelectTable: string;
        andStartOrder: string;
        startOrder: {
          title: string;
          subtitle: string;
          button: string;
        };
        personsLabel: string;
        floorLabel: string;
        tableLabel: string;
        sendToKitchen: string;
        deleteItem: string;
        startNewOrder: string;
        errors: {
          customerRequired: string;
          createOrderFailed: string;
          createCustomerFailed: string;
        };
      };
      orderHistory: {
        title: string;
        invoices: string;
        dateFilter: {
          today: string;
          yesterday: string;
          thisWeek: string;
          lastWeek: string;
          thisMonth: string;
          lastMonth: string;
          reset: string;
          allTime: string;
        };
        statusOptions: {
          all: string;
          preparing: string;
          served: string;
          cancelled: string;
        };
        empty: {
          headingStatus: string;
          headingDefault: string;
          subtitleStatus: string;
          subtitleDefault: string;
        };
        itemCount: string;
        tableLabel: string;
        taxLabel: string;
        subtotal: string;
        success: {
          paymentReceivedTitle: string;
          paymentReceivedSubtitle: string;
          backButton: string;
        };
        orderCard: {
          items: string;
        };
        minLabel: string;
        invoice: {
          title: string;
          tableHeaders: {
            sNo: string;
            invoiceId: string;
            date: string;
            orderType: string;
            totalAmount: string;
            action: string;
          };
          print: string;
          dineIn: string;
        };
      };
      payment: {
        title: string;
        groups: {
          online: string;
          card: string;
          split: string;
        };
        options: {
          cash: string;
          giftcard: string;
          gpay: string;
          applepay: string;
          momo: string;
          orange: string;
          debitcard: string;
          split: string;
        };
        pay: string;
      };
      common: {
        close: string;
      };
      ready: {
        toScan: {
          title: string;
          description: string;
        };
        toPay: {
          title: string;
          description: string;
        };
        done: {
          title: string;
          description: string;
          button: string;
        };
      };
      itemDetails: {
        title: string;
        back: string;
        readMore: string;
        size: string;
        price: string;
        addItem: string;
      };
      addons: {
        title: string;
        draft: string;
        table: string;
        loading: string;
        failed: string;
        note: string;
        notePlaceholder: string;
        save: string;
        extra: string;
      };
      customer: {
        title: string;
        subtitle: string;
        phoneLabel: string;
        phonePlaceholder: string;
        phoneRequired: string;
        phoneInvalid: string;
        nameLabel: string;
        namePlaceholder: string;
        nameRequired: string;
        nameTooShort: string;
        dobLabel: string;
        dobRequired: string;
        dobFuture: string;
        customerTypeLabel: string;
        types: {
          regular: string;
          vip: string;
          member: string;
        };
        cancel: string;
        creating: string;
        create: string;
      };
      logout: {
        prompt: string;
        savePassword: string;
        noStay: string;
        yesSignOut: string;
      };
      signout: {
        title: string;
      };
      floor: {
        title: string;
        subtitle: string;
        selectPersons: string;
        selectFloor: string;
        selectTable: string;
      };
      tables: {
        title: string;
        editTables: string;
        loading: string;
        statusTabs: {
          all: string;
        };
        empty: {
          all: string;
          Served: string;
          Waiting: string;
          Reserved: string;
          Available: string;
        };
        emptySubtitle: {
          all: string;
          Served: string;
          Waiting: string;
          Reserved: string;
          Available: string;
        };
        edit: string;
      };
      actions: {
        cancel: string;
        done: string;
        continue: string;
        sending: string;
      };
      bill: {
        title: string;
        items: string;
        itemsNetTotal: string;
        taxes: string;
        discount: string;
        total: string;
      };
      language: {
        select: string;
      };
      auth: {
        login: {
          title: string;
          welcome: string;
          subtitle: string;
          employeeId: string;
          placeholderId: string;
          password: string;
          placeholderPassword: string;
          forgotPassword: string;
          rememberMe: string;
          submit: string;
          submitting: string;
          success: string;
          failed: string;
        };
      };
    };
  }
}
