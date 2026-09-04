import { createClient } from '@supabase/supabase-js';
import { hashIdentifier } from '@/utils/security';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { phone, identityNumber, deviceFingerprint } = await req.json();

    const phoneHash = hashIdentifier(phone);
    const idHash = hashIdentifier(identityNumber);
    const deviceHash = hashIdentifier(deviceFingerprint);

    const { data: matchedBlacklist, error } = await supabase
      .from('blacklists')
      .select('*')
      .in('identity_hash', [phoneHash, idHash, deviceHash].filter(Boolean));

    if (error) {
      return Response.json({ error: "Security check failed" }, { status: 500 });
    }

    if (matchedBlacklist && matchedBlacklist.length > 0) {
      return Response.json({
        allowed: false,
        message: "Registration restricted: Device or identity detail matches a flagged account."
      }, { status: 403 });
    }

    return Response.json({ allowed: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
