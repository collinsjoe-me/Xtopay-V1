(function (window, document) {
    const XtoPay = {
      init: function (config) {
        // Validate config
        if (
          !config ||
          !config.publicKey ||
          !config.reference ||
          !config.amount ||
          !config.customer ||
          !config.customer.email
        ) {
          console.error(
            "XtoPay: Missing required parameters (publicKey, reference, amount, customer with email)."
          );
          return;
        }
  
        const {
          publicKey,
          reference,
          amount,
          currency = "GHS",
          customer,
          onSuccess,
          onClose,
          mode = "modal", // 'modal' or 'redirect'
        } = config;
  
        // Construct payment URL
        const baseUrl = "https://xtopay.com/pay";
        const queryParams = new URLSearchParams({
          amount: amount.toString(),
          currency,
          name: customer.name || "",
          email: customer.email,
        }).toString();
  
        const paymentUrl = `${baseUrl}/${publicKey}/${reference}?${queryParams}`;
  
        // Redirect Mode
        if (mode === "redirect") {
          window.location.href = paymentUrl;
          return;
        }
  
        // Create full screen modal iframe
        const iframe = document.createElement("iframe");
        iframe.src = paymentUrl;
        iframe.id = "xtopay-modal";
        iframe.style.position = "fixed";
        iframe.style.top = "0";
        iframe.style.left = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.style.zIndex = "9999";
        iframe.style.backgroundColor = "#fff";
  
        // Append to DOM
        document.body.appendChild(iframe);
  
        // ESC to close
        const escListener = (e) => {
          if (e.key === "Escape") {
            XtoPay.closeModal(onClose);
          }
        };
        window.addEventListener("keydown", escListener);
  
        // Listen for iframe messages
        const messageListener = function (event) {
          if (!event.data || typeof event.data !== "object") return;
  
          if (event.data.source === "xtopay") {
            if (event.data.status === "success") {
              onSuccess?.(event.data.response);
            }
            XtoPay.closeModal(onClose);
            window.removeEventListener("message", messageListener);
            window.removeEventListener("keydown", escListener);
          }
        };
  
        window.addEventListener("message", messageListener);
      },
  
      closeModal: function (onClose) {
        const modal = document.getElementById("xtopay-modal");
        if (modal) {
          document.body.removeChild(modal);
          onClose?.();
        }
      },
    };
  
    window.XtoPay = XtoPay;
  })(window, document);
  