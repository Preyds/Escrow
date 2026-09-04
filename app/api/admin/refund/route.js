import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { dealId, paystackReference, adminKey } = await req.json();

    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return Response.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const paystackResponse = await fetch('https://api.paystack.co/refund', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transaction: paystackReference,
        merchant_note: `Full escrow refund issued for deal ID: ${dealId}`
      })
    });

    const refundResult = await paystackResponse.json();

    if (!refundResult.status) {
      return Response.json({ error: refundResult.message }, { status: 400 });
    }

    await supabase
      .from('deals')
      .update({ status: 'refunded' })
      .eq('id', dealId);

    await supabase
      .from('disputes')
      .update({ 
        status: 'resolved_buyer_refund',
        admin_notes: `Refund processed successfully. Paystack Refund ID: ${refundResult.data.id}`
      })
      .eq('deal_id', dealId);

    return Response.json({ success: true, refund: refundResult });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
          }
          
