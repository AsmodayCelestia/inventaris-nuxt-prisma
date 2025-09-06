// composables/useMenu.js
import { computed } from 'vue'
import { HomeIcon } from '@heroicons/vue/24/outline'
import {
  CubeIcon,
  ArchiveBoxIcon,
  WrenchScrewdriverIcon,
  QrCodeIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

const iconMap = {
  'i-heroicons-home': HomeIcon,
  'i-heroicons-cube': CubeIcon,
  'i-heroicons-archive-box': ArchiveBoxIcon,
  'i-heroicons-wrench-screwdriver': WrenchScrewdriverIcon,
  'i-heroicons-qr-code': QrCodeIcon,
  'i-heroicons-clock': ClockIcon
}

export const useMenu = () => {
  const {
    userRole,
    authReady,
    canAccessMaintenance,
    isRoomSupervisor
  } = useAuth()

  const fullMenu = [
    {
      label: 'Dashboard',
      icon: 'i-heroicons-home',
      to: '/dashboard',
      roles: ['admin', 'head', 'karyawan']
    },
    {
      label: 'Master Data',
      icon: 'i-heroicons-cube',
      roles: ['admin'],
      children: [
        { label: 'Merk', to: '/master-data/brands', roles: ['admin'] },
        { label: 'Kategori', to: '/master-data/categories', roles: ['admin'] },
        { label: 'Jenis', to: '/master-data/item-types', roles: ['admin'] },
        { label: 'Lantai', to: '/master-data/floors', roles: ['admin'] },
        { label: 'Ruang', to: '/master-data/rooms', roles: ['admin'] },
        { label: 'Unit Lokasi', to: '/master-data/units', roles: ['admin'] },
        { label: 'Divisi', to: '/master-data/divisions', roles: ['admin'] },
        { label: 'User', to: '/master-data/users', roles: ['admin'] }
      ]
    },
    {
      label: 'Inventaris',
      icon: 'i-heroicons-archive-box',
      roles: ['admin', 'head', 'karyawan'],
      children: [
        { label: 'Unit Inventaris', to: '/inventories', roles: ['admin', 'head', 'karyawan'] },
        { label: 'Master Barang', to: '/inventories/master-barang', roles: ['admin', 'head'] }
      ]
    },
    {
      label: 'Maintenance',
      icon: 'i-heroicons-wrench-screwdriver',
      // hanya muncul kalau user boleh akses maintenance
      show: () => canAccessMaintenance.value,
      roles: ['admin', 'head', 'karyawan'],
      children: [
        { label: 'Maintenance Selesai', to: '/maintenance/done', roles: ['admin', 'head', 'karyawan'] },
        { label: 'Maintenance List', to: '/maintenance/list', roles: ['admin', 'head'] },
        { label: 'Perlu Maintenance', to: '/maintenance/needed', roles: ['admin', 'head', 'karyawan'] },
        // laporan bulanan hanya untuk supervisor ruangan
        { label: 'Laporan Bulanan', to: '/maintenance/monthly-report', roles: ['admin', 'head', 'karyawan'], show: () => isRoomSupervisor.value }
      ]
    },
    {
      label: 'QR Code',
      icon: 'i-heroicons-qr-code',
      roles: ['admin', 'head', 'karyawan'],
      children: [
        { label: 'Generate & Cetak', to: '/manage-qrcodes', roles: ['admin', 'head'] },
        { label: 'Scan QR', to: '/scan-qrcode', roles: ['admin', 'head', 'karyawan'] }
      ]
    },
    {
      label: 'Activity Log',
      icon: 'i-heroicons-clock',
      to: '/activity-log',
      roles: ['admin']
    }
  ]

  const allowedMenu = computed(() => {
    if (!authReady.value || !userRole.value) return []

    return fullMenu
      .filter(g => (g.show ? g.show() : true))              // filter group
      .map(g => ({
        ...g,
        icon: iconMap[g.icon] || HomeIcon,
        children: g.children
          ?.filter(c => c.roles.includes(userRole.value) && (c.show ? c.show() : true))
          .map(c => ({ ...c, icon: iconMap[c.icon] || HomeIcon }))
      }))
      .filter(g =>
        g.roles.includes(userRole.value) &&
        (g.children ? g.children.length > 0 : true)
      )
  })

  return { menu: allowedMenu }
}