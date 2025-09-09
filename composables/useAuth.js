// composables/useAuth.js
export const useAuth = () => {
  /* ---------- state ---------- */
  const authUser  = useState('auth.user',  () => null)
  const authReady = useState('auth.ready', () => false)
  const pageLoading = useState('page.loading', () => false)

  /* ---------- cookie ---------- */
  // token httpOnly (aman)
  const token = useCookie('auth-token', {
    default: () => null,
    httpOnly: false,        // ubah ke true di prod bila mau SSR baca
    secure: !process.dev,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7
  })

  // cookie flag (non-sensitif, bisa dibaca SSR & client)
  const cRole  = useCookie('auth-role',  { default: () => '',  httpOnly: false })
  const cName  = useCookie('auth-name',  { default: () => '',  httpOnly: false })
  const cDiv   = useCookie('auth-div',   { default: () => '',  httpOnly: false })
  const cPjM   = useCookie('auth-pjm',   { default: () => false, httpOnly: false })
  const cSup   = useCookie('auth-sup',   { default: () => false, httpOnly: false })
  const cRooms = useCookie('auth-rooms', { default: () => [],   httpOnly: false })

  /* ---------- getter ---------- */
  // baca dari state dulu, kalau kosong baru cookie (supaya tetap reaktif)
  const isLoggedIn = computed(() => !!authUser.value || !!cRole.value)
  const isAdmin    = computed(() => authUser.value?.role === 'admin' || cRole.value === 'admin')
  const isHead     = computed(() => authUser.value?.role === 'head'  || cRole.value === 'head')
  const isKaryawan = computed(() => authUser.value?.role === 'karyawan' || cRole.value === 'karyawan')
  const userDivisi = computed(() => authUser.value?.division ?? cDiv.value ?? '')
  const userName   = computed(() => authUser.value?.name    ?? cName.value ?? '')
  const userRole   = computed(() => authUser.value?.role    ?? cRole.value ?? '')

  const isPjMaintenance   = computed(() => !!authUser.value?.isPjMaintenance  || cPjM.value)
  const isRoomSupervisor  = computed(() => !!authUser.value?.isRoomSupervisor || cSup.value)
  const assignedRooms     = computed(() => authUser.value?.assignedRooms || cRooms.value || [])

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
    if (process.server) return                 // <-- jangan jalanin di server

    const ANIM_MIN = 700                       // minimal animasi 700 ms
    const start    = Date.now()                // catat waktu mulai

    // kalau tidak ada token sama sekali → tetap tampilkan animasi
    if (!token.value) {
      await new Promise(r => setTimeout(r, ANIM_MIN))
      authReady.value = true
      return
    }

    // ---------- cookie flag lengkap ----------
    if (cRole.value && cName.value) {
      // hydrate cepat dari cookie
      authUser.value = {
        role: cRole.value,
        name: cName.value,
        division: cDiv.value,
        isPjMaintenance: cPjM.value,
        isRoomSupervisor: cSup.value,
        assignedRooms: cRooms.value,
      }

      // TUNGGU sampai 700 ms tercapai
      const elapsed = Date.now() - start
      if (elapsed < ANIM_MIN) {
        await new Promise(r => setTimeout(r, ANIM_MIN - elapsed))
      }
      authReady.value = true

      // baru background refresh (optional, tidak blok)
      $fetch('/api/users/me', { credentials: 'include' })
        .then(u => Object.assign(authUser.value, u))
        .catch(() => {})
      return
    }

    // ---------- cookie kosong → fetch full ----------
    try {
      const user = await $fetch('/api/users/me', { credentials: 'include' })
      authUser.value = user
      // update cookie flag
      cRole.value  = user.role
      cName.value  = user.name
      cDiv.value   = user.division
      cPjM.value   = user.isPjMaintenance
      cSup.value   = user.isRoomSupervisor
      cRooms.value = user.assignedRooms || []
    } catch {
      authUser.value = null
      token.value    = null
      // clear cookie flag
      cRole.value = ''; cName.value = ''; cDiv.value = ''
      cPjM.value = false; cSup.value = false; cRooms.value = []
    } finally {
      // pastikan tetap 700 ms minimal
      const elapsed = Date.now() - start
      if (elapsed < ANIM_MIN) {
        await new Promise(r => setTimeout(r, ANIM_MIN - elapsed))
      }
      authReady.value = true
    }
  }

  const login = async (email, password) => {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
      credentials: 'include'
    })
    const u = res.user
    authUser.value = u
    // update cookie flag
    cRole.value  = u.role
    cName.value  = u.name
    cDiv.value   = u.division
    cPjM.value   = u.isPjMaintenance
    cSup.value   = u.isRoomSupervisor
    cRooms.value = u.assignedRooms || []
  }

  const logout = async () => {
    // clear semua
    token.value = null
    authUser.value = null
    cRole.value = ''; cName.value = ''; cDiv.value = ''
    cPjM.value = false; cSup.value = false; cRooms.value = []
    await navigateTo('/login')
  }

  /* ---------- init otomatis (client saja) ---------- */
  // if (process.client) initializeAuth()

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
    logout,
    pageLoading: readonly(pageLoading)
  }
}