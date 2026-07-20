import { createClient } from 'npm:@supabase/supabase-js@2';

const allowedOrigins = new Set([
  'https://squargraph.com',
  'https://www.squargraph.com',
  'http://127.0.0.1:4177',
  'http://localhost:4177',
]);

function corsHeaders(request: Request) {
  const origin = request.headers.get('origin') || '';
  return {
    'Access-Control-Allow-Origin': allowedOrigins.has(origin) ? origin : 'https://squargraph.com',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

function response(request: Request, status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), 'Content-Type': 'application/json; charset=utf-8' },
  });
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request) });
  if (request.method !== 'POST') return response(request, 405, { error: 'Method not allowed.' });

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const authorization = request.headers.get('Authorization') || '';
  if (!supabaseUrl || !anonKey || !serviceRoleKey || !authorization) {
    return response(request, 500, { error: 'The invitation service is not configured.' });
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false },
  });
  const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) return response(request, 401, { error: 'Authentication required.' });

  const { data: allowed, error: permissionError } = await userClient.rpc('os_can', { requested_permission: 'users.invite' });
  if (permissionError || allowed !== true) return response(request, 403, { error: 'You do not have permission to invite users.' });

  let body: { email?: string; full_name?: string; role_key?: string };
  try {
    body = await request.json();
  } catch {
    return response(request, 400, { error: 'Invalid request body.' });
  }

  const email = String(body.email || '').trim().toLowerCase();
  const fullName = String(body.full_name || '').trim().slice(0, 120);
  const roleKey = String(body.role_key || '').trim();
  if (!/^\S+@\S+\.\S+$/.test(email) || !fullName || !roleKey) {
    return response(request, 400, { error: 'Name, email and role are required.' });
  }

  const rateWindow = new Date(Date.now() - 60000).toISOString();
  const { count: recentInvites } = await adminClient.from('os_invitations')
    .select('id', { count: 'exact', head: true })
    .eq('invited_by', userData.user.id)
    .gte('created_at', rateWindow);
  if (Number(recentInvites || 0) >= 5) {
    return response(request, 429, { error: 'Invitation rate limit reached. Try again in one minute.' });
  }

  const { data: role, error: roleError } = await adminClient.from('os_roles').select('id,role_key,rank').eq('role_key', roleKey).single();
  if (roleError || !role) return response(request, 400, { error: 'The selected workspace role is invalid.' });

  const { data: inviter } = await adminClient.from('os_members').select('role:os_roles(rank)').eq('user_id', userData.user.id).single();
  const inviterRank = Number((inviter?.role as { rank?: number } | null)?.rank || 0);
  if (Number(role.rank) >= inviterRank && role.role_key !== 'guest') {
    return response(request, 403, { error: 'You may only invite users into a lower workspace role.' });
  }

  await adminClient.from('os_invitations').update({ status: 'revoked' }).eq('email', email).in('status', ['pending', 'sent']);
  const { data: invitation, error: invitationError } = await adminClient.from('os_invitations').insert({
    email,
    full_name: fullName,
    role_id: role.id,
    status: 'pending',
    invited_by: userData.user.id,
    expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
  }).select('id').single();

  if (invitationError || !invitation) return response(request, 409, { error: invitationError?.message || 'An active invitation already exists.' });

  const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
    redirectTo: 'https://squargraph.com/register',
    data: { full_name: fullName, workspace_role: roleKey },
  });

  if (inviteError || !inviteData.user) {
    await adminClient.from('os_invitations').update({ status: 'revoked' }).eq('id', invitation.id);
    return response(request, 400, { error: inviteError?.message || 'Supabase could not send the invitation.' });
  }

  const { error: memberError } = await adminClient.from('os_members').upsert({
    user_id: inviteData.user.id,
    email,
    role_id: role.id,
    status: 'active',
    invited_by: userData.user.id,
  }, { onConflict: 'user_id' });
  if (memberError) return response(request, 500, { error: 'The invitation was sent, but workspace membership could not be created.' });

  await adminClient.from('os_profiles').upsert({ user_id: inviteData.user.id, full_name: fullName }, { onConflict: 'user_id' });
  await adminClient.from('os_invitations').update({ status: 'sent' }).eq('id', invitation.id);
  await adminClient.from('os_audit_log').insert({
    actor_id: userData.user.id,
    action: 'invite_user',
    entity_type: 'os_members',
    entity_id: inviteData.user.id,
    metadata: { role_key: roleKey },
  });

  return response(request, 200, { ok: true, invitation_id: invitation.id });
});
