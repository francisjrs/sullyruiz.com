import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "session_id is required" },
        { status: 400 }
      );
    }

    // Try to fetch lead data from n8n if webhook is configured
    const webhookUrl = process.env.N8N_LEAD_LOOKUP_WEBHOOK_URL;
    const apiKey = process.env.N8N_API_KEY;

    if (webhookUrl) {
      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (apiKey) {
          headers["X-API-Key"] = apiKey;
        }

        const response = await fetch(webhookUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({ session_id: sessionId }),
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            success: true,
            email: data.email || "",
            phone: data.phone || "",
            name: data.name || "",
          });
        }
      } catch (error) {
        console.error("Error fetching lead data:", error);
      }
    }

    // Return empty data if webhook not configured or failed
    // The form can still be used without prefill
    return NextResponse.json({
      success: true,
      email: "",
      phone: "",
      name: "",
    });
  } catch (error) {
    console.error("Error in prefill endpoint:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
