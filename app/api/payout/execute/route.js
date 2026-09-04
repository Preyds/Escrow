import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { dealId } = await req.json();

    if (!dealId) {
      return Response.json({ error: "Deal ID is required" }, { status: 400 });
    }

    const { data: deal, error: dealErr } = await supabase
      .from('deals')
      .select('*, seller:seller_id(*)')
      .eq('id', dealId)
      .single();

    if (dealErr || !deal) {
      return Response.json({ error: "Deal record not found" }, { status: 404 });
    }

    if (deal.status === 'disputed' || deal.status === 'frozen') {
      return Response.json({ error: "Payout Guard Blocked: Active dispute or frozen status on deal." }, { status: 400 });
    }

    if (deal.status !== 'completed') {
      return Response.json({ error: "Payout Guard Blocked: Deal is not marked as completed by buyer." }, { status: 400 });
    }

    if (deal.seller && deal.seller.is_banned) {
      return Response.json({ error: "Payout Guard Blocked: Seller account has been flagged or banned." }, { status: 403 });
    }

    const paystackRes = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: "balance",
        amount: Math.round(deal.amount * 100),
        recipient: deal.seller.paystack_recipient_code,
        reason: `Escrow Payout for Tradescrow Trade #${deal.id.substring(0, 8)}`
      })
    });

    const transferData = await paystackRes.json();

    if (!transferData.status) {
      return Response.json({ error: transferData.message }, { status: 400 });
    }

    await supabase
      .from('deals')
      .update({ status: 'payout_completed' })
      .eq('id', dealId);

    return Response.json({ success: true, transfer: transferData });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
        }
