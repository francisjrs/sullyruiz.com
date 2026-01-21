import { NextResponse } from "next/server";
import { validateEmail, validatePhone, validateName, normalizePhone } from "@/lib/validation";

interface ScreeningData {
  email: string;
  phone: string;
  fullName: string;
  hasPreapproval: string;
  immigrationStatus: string;
  monthlyIncome: string;
  monthlyDebt: string;
  paymentType: string;
  employmentType: string;
  creditScore: string;
  hasAutoLoan: string;
  hasCreditCards: string;
  taxYears: string;
  downPayment: string;
  savingsLocation: string;
  leaseEndDate: string;
  moveDate: string;
  propertyType: string;
  isHomeowner: string;
  willSellHome: string;
  buyingWith: string;
  militaryService: string;
  additionalInfo: string;
}

interface ScreeningPayload {
  session_id: string | null;
  locale: string;
  screening: ScreeningData;
}

// Calculate lead score based on screening answers
function calculateLeadScore(data: ScreeningData): { score: number; tier: string } {
  let score = 0;

  // Primary Factors (heavily weighted)

  // Has pre-approval: +35
  if (data.hasPreapproval === "yes") {
    score += 35;
  }

  // Credit score
  switch (data.creditScore) {
    case "700plus":
      score += 30;
      break;
    case "640to699":
      score += 20;
      break;
    case "600to639":
      score += 10;
      break;
    // below600 and unknown: 0
  }

  // Move date / timeline
  switch (data.moveDate) {
    case "under1month":
      score += 25;
      break;
    case "1to3months":
      score += 15;
      break;
    case "3to6months":
      score += 10;
      break;
    case "6plusMonths":
      score += 5;
      break;
  }

  // Secondary Factors

  // Down payment
  const downPaymentNum = parseFloat(data.downPayment) || 0;
  if (downPaymentNum >= 20000) {
    score += 15;
  } else if (downPaymentNum >= 10000) {
    score += 10;
  } else if (downPaymentNum > 0) {
    score += 5;
  }

  // Tax years filed
  if (data.taxYears === "twoPlus") {
    score += 10;
  }

  // W2 employment
  if (data.employmentType === "w2") {
    score += 5;
  }

  // Cap at 100
  score = Math.min(score, 100);

  // Determine tier
  let tier: string;
  if (score >= 80) {
    tier = "hot";
  } else if (score >= 50) {
    tier = "warm";
  } else if (score >= 25) {
    tier = "developing";
  } else {
    tier = "cold";
  }

  return { score, tier };
}

export async function POST(request: Request) {
  try {
    const body: ScreeningPayload = await request.json();

    // Validate required fields
    if (!body.screening || !body.locale) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { screening } = body;

    // Validate contact information
    const errors: Record<string, string> = {};

    const nameResult = validateName(screening.fullName);
    if (!nameResult.valid && nameResult.error) {
      errors.fullName = nameResult.error;
    }

    const emailResult = validateEmail(screening.email);
    if (!emailResult.valid && emailResult.error) {
      errors.email = emailResult.error;
    }

    if (screening.phone) {
      const phoneResult = validatePhone(screening.phone);
      if (!phoneResult.valid && phoneResult.error) {
        errors.phone = phoneResult.error;
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    // Normalize phone number
    if (screening.phone) {
      screening.phone = normalizePhone(screening.phone);
    }

    // Calculate lead score
    const { score, tier } = calculateLeadScore(screening);

    // Log the screening (for development)
    console.log("New screening received:", JSON.stringify({
      session_id: body.session_id,
      locale: body.locale,
      lead_score: score,
      lead_tier: tier,
    }, null, 2));

    // Forward to n8n webhook if configured
    const webhookUrl = process.env.N8N_SCREENING_WEBHOOK_URL;
    const apiKey = process.env.N8N_API_KEY;

    if (webhookUrl) {
      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (apiKey) {
          headers["X-API-Key"] = apiKey;
        }

        const webhookResponse = await fetch(webhookUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            session_id: body.session_id,
            locale: body.locale,
            screening: screening,
            lead_score: score,
            lead_tier: tier,
            timestamp: new Date().toISOString(),
            source: "sullyruiz.com",
          }),
        });

        if (!webhookResponse.ok) {
          console.error(
            "Screening webhook response not OK:",
            webhookResponse.status,
            await webhookResponse.text()
          );
        }
      } catch (webhookError) {
        // Log webhook error but don't fail the request
        console.error("Error forwarding screening to webhook:", webhookError);
      }
    } else {
      console.log("N8N_SCREENING_WEBHOOK_URL not configured - screening stored locally only");
    }

    return NextResponse.json({
      success: true,
      message: "Screening received successfully",
      lead_score: score,
      lead_tier: tier,
    });
  } catch (error) {
    console.error("Error processing screening:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
