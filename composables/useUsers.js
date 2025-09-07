export const useUsers = () => {
  const users = useState('users', () => [])

  const fetchUsers = async () => {
    users.value = await $fetch('/api/users')
  }

  const createUser = async (payload) => {
    await $fetch('/api/users', { method: 'POST', body: payload })
    await fetchUsers()
  }

  const updateUser = async (id, payload) => {
    await $fetch(`/api/users/${id}`, { method: 'PUT', body: payload })
    await fetchUsers()
  }

  const deleteUser = async (id) => {
    await $fetch(`/api/users/${id}`, { method: 'DELETE' })
    await fetchUsers()
  }

  return {
    users: readonly(users),
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  }
}