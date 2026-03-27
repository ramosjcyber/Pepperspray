import { useEffect, useRef, useState } from "react";

function getSquareScriptUrl(env) {
  return env === "production"
    ? "https://web.squarecdn.com/v1/square.js"
    : "https://sandbox.web.squarecdn.com/v1/square.js";
}

function loadSquareScript(env) {
  return new Promise((resolve, reject) => {
    if (window.Square) {
      resolve(window.Square);
      return;
    }

    const existing = document.querySelector('script[data-square-sdk="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.Square));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = getSquareScriptUrl(env);
    script.async = true;
    script.dataset.squareSdk = "true";
    script.onload = () => resolve(window.Square);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function CashAppPayButton({ total, cart, onPaid }) {
  const containerRef = useRef(null);
  const cashAppRef = useRef(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        setLoading(true);
        setStatus("");

        const appId = import.meta.env.VITE_SQUARE_APP_ID;
        const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;
        const env = import.meta.env.VITE_SQUARE_ENV || "sandbox";

        if (!appId || !locationId) {
          throw new Error("Missing VITE_SQUARE_APP_ID or VITE_SQUARE_LOCATION_ID");
        }

        const Square = await loadSquareScript(env);
        if (!mounted) return;

        const payments = Square.payments(appId, locationId);

        const paymentRequest = payments.paymentRequest({
          countryCode: "US",
          currencyCode: "USD",
          total: {
            amount: Number(total).toFixed(2),
            label: "Total"
          }
        });

        const cashAppPay = await payments.cashAppPay(paymentRequest, {
          redirectURL: `${window.location.origin}/`,
          referenceId: `books-${Date.now()}`
        });

        if (!mounted) return;

        cashAppRef.current = cashAppPay;
        await cashAppPay.attach(containerRef.current);

        cashAppPay.addEventListener("ontokenization", async (event) => {
          const { tokenResult, error } = event.detail;

          if (error) {
            setStatus("Cash App authorization failed.");
            return;
          }

          if (tokenResult?.status !== "OK") {
            setStatus("Cash App payment was cancelled or not approved.");
            return;
          }

          setStatus("Processing payment...");

          const res = await fetch("/api/create-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              sourceId: tokenResult.token,
              amount: total,
              orderItems: cart
            })
          });

          const data = await res.json();

          if (!res.ok) {
            console.error(data);
            setStatus("Payment failed. Please try again.");
            return;
          }

          setStatus("Payment complete.");
          onPaid?.(data);
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setStatus("Could not load Cash App Pay.");
        setLoading(false);
      }
    }

    init();

    return () => {
      mounted = false;
      if (cashAppRef.current?.destroy) {
        cashAppRef.current.destroy().catch(() => {});
      }
    };
  }, [total, cart, onPaid]);

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="min-h-[56px] rounded-2xl overflow-hidden"
      />
      {loading && (
        <p className="text-sm text-zinc-500">Loading Cash App Pay...</p>
      )}
      {status && (
        <p className="text-sm text-zinc-600">{status}</p>
      )}
    </div>
  );
}
