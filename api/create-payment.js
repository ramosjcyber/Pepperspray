export async function POST(request) {
  try {
    const body = await request.json();
    const { sourceId, amount, orderItems = [] } = body;

    if (!sourceId || !amount) {
      return new Response(
        JSON.stringify({ error: "Missing sourceId or amount" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const locationId = process.env.SQUARE_LOCATION_ID;

    if (!accessToken || !locationId) {
      return new Response(
        JSON.stringify({ error: "Missing Square server environment variables" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const isSandbox =
      (process.env.VITE_SQUARE_ENV || "").toLowerCase() === "sandbox";

    const baseUrl = isSandbox
      ? "https://connect.squareupsandbox.com/v2/payments"
      : "https://connect.squareup.com/v2/payments";

    const idempotencyKey =
      globalThis.crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const squareRes = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Square-Version": "2025-10-16"
      },
      body: JSON.stringify({
        source_id: sourceId,
        idempotency_key: idempotencyKey,
        location_id: locationId,
        amount_money: {
          amount: Math.round(Number(amount) * 100),
          currency: "USD"
        },
        note: "Book order",
        autocomplete: true,
        reference_id: `books-${Date.now()}`,
        buyer_email_address: undefined,
        order: {
          location_id: locationId,
          line_items: orderItems.map((item) => ({
            name: item.title || "Book",
            quantity: String(item.qty || 1),
            base_price_money: {
              amount: Math.round(Number(item.price || 0) * 100),
              currency: "USD"
            }
          }))
        }
      })
    });

    const data = await squareRes.json();

    if (!squareRes.ok) {
      return new Response(JSON.stringify(data), {
        status: squareRes.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Payment failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
