const PLACEHOLDER_VALUES = new Set([
  '',
  'your_supabase_url',
  'your_supabase_anon_key',
  'your_supabase_service_role_key',
  'your_service_role_key',
  'your-anon-key',
  'your-service-role-key',
])

function isRealValue(value: string | undefined) {
  if (!value) return false
  const trimmed = value.trim()
  if (!trimmed) return false
  if (PLACEHOLDER_VALUES.has(trimmed)) return false
  if (trimmed.includes('your_') || trimmed.includes('your-')) return false
  if (trimmed.includes('placeholder')) return false
  return true
}

export function hasUsableSupabaseConfig() {
  return isRealValue(process.env.NEXT_PUBLIC_SUPABASE_URL)
    && isRealValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export function hasUsableAdminSupabaseConfig() {
  return hasUsableSupabaseConfig()
    && isRealValue(process.env.SUPABASE_SERVICE_ROLE_KEY)
}
