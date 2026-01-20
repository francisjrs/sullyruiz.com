import { NextResponse } from "next/server";

interface LeadMagnetPayload {
  type: "lead_magnet";
  contact: {
    firstName: string;
    email: string;
  };
  locale: string;
}

interface ChatWizardPayload {
  type: "chat_wizard";
  flow: "buy" | "sell";
  answers: {
    propertyType?: string;
    area?: string;
    budget?: string;
    timeline?: string;
    reason?: string;
    address?: string;
  };
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  locale: string;
}

type LeadPayload = LeadMagnetPayload | ChatWizardPayload;

export async function POST(request: Request) {
  try {
    const body: LeadPayload = await request.json();

    // Validate required fields
    if (!body.type || !body.locale) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (body.type === "lead_magnet") {
      if (!body.contact?.firstName || !body.contact?.email) {
        return NextResponse.json(
          { error: "Missing contact information" },
          { status: 400 }
        );
      }
    } else if (body.type === "chat_wizard") {
      if (!body.contact?.name || !body.contact?.email) {
        return NextResponse.json(
          { error: "Missing contact information" },
          { status: 400 }
        );
      }
    }

    // Log the lead (for development)
    console.log("New lead received:", JSON.stringify(body, null, 2));

    // Forward to n8n webhook if configured
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...body,
            timestamp: new Date().toISOString(),
            source: "sullyruiz.com",
          }),
        });

        if (!webhookResponse.ok) {
          console.error(
            "Webhook response not OK:",
            webhookResponse.status,
            await webhookResponse.text()
          );
        }
      } catch (webhookError) {
        // Log webhook error but don't fail the request
        console.error("Error forwarding to webhook:", webhookError);
      }
    } else {
      console.log("N8N_WEBHOOK_URL not configured - lead stored locally only");
    }

    return NextResponse.json({
      success: true,
      message: "Lead received successfully",
    });
  } catch (error) {
    console.error("Error processing lead:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
