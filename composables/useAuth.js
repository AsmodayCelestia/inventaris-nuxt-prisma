export const useAuth = () => {
  /* ---------- state ---------- */
  const authUser  = useState('auth.user',  () => null)
  const authReady = useState('auth.ready', () => false)

  /* ---------- cookie ---------- */
  const token = useCookie('auth-token', {
    default: () => null,
    httpOnly: false,
    secure: !process.dev,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7
  })

  /* ---------- getter ---------- */
  const isLoggedIn = computed(() => !!authUser.value)
  const isAdmin    = computed(() => authUser.value?.role === 'admin')
  const isHead     = computed(() => authUser.value?.role === 'head')
  const isKaryawan = computed(() => authUser.value?.role === 'karyawan')
  const userDivisi = computed(() => authUser.value?.division ?? '')
  const userName   = computed(() => authUser.value?.name    ?? '')
  const userRole   = computed(() => authUser.value?.role    ?? '')

  /* ---------- hak akses baru ---------- */
  const isPjMaintenance   = computed(() => !!authUser.value?.isPjMaintenance)
  const isRoomSupervisor  = computed(() => !!authUser.value?.isRoomSupervisor)
  const assignedRooms     = computed(() => authUser.value?.assignedRooms ?? [])

  const canAccessMaintenance = computed(() => isAdmin.value || userDivisi.value === 'Umum')
  const canSeePrice          = computed(() => isAdmin.value || userDivisi.value === 'Keuangan')
  const canUpdatePrice       = computed(() => isAdmin.value || userDivisi.value === 'Keuangan')

  const canReportRoom = (roomId) => {
    if (isAdmin.value) return true
    if (!isRoomSupervisor.value) return false
    return assignedRooms.value.includes(roomId)
  }

  /* ---------- action ---------- */
  const initializeAuth = async () => {
    if (process.server) return
    if (!token.value) { authReady.value = true; return }

    try {
      // 1. ambil user
      const user = await $fetch('/api/users/me', { credentials: 'include' })
      authUser.value = user

    } catch {
      authUser.value = null
      token.value    = null
    } finally {
      authReady.value = true // baru hilang overlay
    }
  }

  const login = async (email, password) => {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
      credentials: 'include'
    })
    authUser.value = res.user
  }

  const logout = async () => {
    token.value = null
    authUser.value = null
    await navigateTo('/login')
  }

  /* ---------- init otomatis (client saja) ---------- */
  if (process.client) initializeAuth()

  return {
    authUser:  readonly(authUser),
    authReady: readonly(authReady),
    isLoggedIn,
    isAdmin,
    isHead,
    isKaryawan,
    userDivisi,
    userName,
    userRole,
    isPjMaintenance,
    isRoomSupervisor,
    assignedRooms,
    canAccessMaintenance,
    canSeePrice,
    canUpdatePrice,
    canReportRoom,
    initializeAuth,
    login,
    logout
  }
}