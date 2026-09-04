import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const dealId = searchParams.get('dealId');
  const adminKey = searchParams.get('adminKey');

  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return Response.json({ error: "Unauthorized access" }, { status: 401 });
  }

  if (!dealId) {
    return Response.json({ error: "Missing deal ID" }, { status: 400 });
  }

  const { data: deal } = await supabase
    .from('deals')
    .select('*, buyer:buyer_id(*), seller:seller_id(*)')
    .eq('id', dealId)
    .single();

  const { data: chatLogs } = await supabase
    .from('messages')
    .select('*')
    .eq('deal_id', dealId)
    .order('created_at', { ascending: true });

  const { data: disputeData } = await supabase
    .from('disputes')
    .select('*')
    .eq('deal_id', dealId);

  const dossier = {
    metadata: {
      report_generated_at: new Date().toISOString(),
      case_reference: `TRADESCROW-CASE-${dealId.substring(0, 8).toUpperCase()}`,
      legal_notice: "Confidential audit log compiled for regulatory, compliance, or law enforcement investigation under NDPA guidelines."
    },
    transaction_details: deal,
    dispute_history: disputeData || [],
    chat_transcript: chatLogs || [],
    audit_identifiers: {
      buyer_device_hash: deal?.buyer?.device_hash || "N/A",
      seller_device_hash: deal?.seller?.device_hash || "N/A",
      paystack_reference: deal?.paystack_reference || "N/A"
    }
  };

  return new Response(JSON.stringify(dossier, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="Case_Report_${dealId}.json"`
    }
  });
}
