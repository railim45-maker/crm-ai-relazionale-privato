export function isPlaceholderSupabaseValue(value: string | undefined) {
  const normalized = (value || '').trim()
  if (!normalized) return true
  const upper = normalized.toUpperCase()
  return (
    upper.includes('YOUR_') ||
    upper.includes('PLACEHOLDER') ||
    upper.includes('REPLACE_ME') ||
    upper.includes('CHANGEME') ||
    normalized.includes('YOUR_PROJECT.supabase.co') ||
    normalized === 'https://your-project.supabase.co'
  )
}

export function hasUsablePublicSupabaseConfig() {
  return (
    !isPlaceholderSupabaseValue(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    !isPlaceholderSupabaseValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  )
}

export function hasUsableAdminSupabaseConfig() {
  return (
    hasUsablePublicSupabaseConfig() &&
    !isPlaceholderSupabaseValue(process.env.SUPABASE_SERVICE_ROLE_KEY)
  )
}
