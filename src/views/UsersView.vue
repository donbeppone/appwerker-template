<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users.js'
import { useRollenStore } from '@/stores/rollen.js'
import { useAuthStore } from '@/stores/auth.js'
import { useToast } from '@/composables/useToast.js'
import { useConfirm } from '@/composables/useConfirm.js'
import { usePermissions, MODULES, ACTION_LABELS } from '@/composables/usePermissions.js'
import PageHeader from '@/components/shared/PageHeader.vue'
import LoadingState from '@/components/shared/LoadingState.vue'

const usersStore = useUsersStore()
const rollenStore = useRollenStore()
const auth = useAuthStore()
const toast = useToast()
const confirm = useConfirm()
const { canWrite } = usePermissions()

const search = ref('')
const loading = ref(true)

// ── Invite Dialog ──
const showInvite = ref(false)
const inviteForm = ref({ vorname: '', nachname: '', email: '', rolle: '' })
const inviteLoading = ref(false)

// ── Role Dialog ──
const showRoleDialog = ref(false)
const roleForm = ref({ name: '', istAdmin: false, berechtigungen: [], sortierung: 0 })
const editRoleId = ref(null)
const roleLoading = ref(false)

onMounted(async () => {
  await Promise.all([usersStore.fetchUsers(), rollenStore.fetchRollen()])
  loading.value = false
})

const filteredUsers = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return usersStore.users
  return usersStore.users.filter((u) =>
    [u.vorname, u.nachname, u.email].some((v) => v?.toLowerCase().includes(q)),
  )
})

function getRolleName(rolleId) {
  if (!rolleId) return '—'
  const r = rollenStore.getRolleById(rolleId)
  return r?.name || '—'
}

function isCurrentUser(userDoc) {
  return auth.user?.email && userDoc.email === auth.user.email
}

// ── Invite ──
function openInvite() {
  inviteForm.value = { vorname: '', nachname: '', email: '', rolle: '' }
  showInvite.value = true
}

async function submitInvite() {
  if (!inviteForm.value.nachname || !inviteForm.value.email) return
  inviteLoading.value = true
  try {
    await usersStore.inviteUser(inviteForm.value)
    toast.success('Benutzer eingeladen')
    showInvite.value = false
  } catch (e) {
    toast.error(e.message || 'Einladung fehlgeschlagen')
  } finally {
    inviteLoading.value = false
  }
}

// ── Change Role ──
const changeRoleUser = ref(null)
const changeRoleValue = ref('')
const showChangeRole = ref(false)

function openChangeRole(userDoc) {
  changeRoleUser.value = userDoc
  changeRoleValue.value = userDoc.rolle || ''
  showChangeRole.value = true
}

async function submitChangeRole() {
  if (!changeRoleUser.value) return
  try {
    await usersStore.updateUser(changeRoleUser.value.$id, { rolle: changeRoleValue.value })
    toast.success('Rolle aktualisiert')
    showChangeRole.value = false
  } catch (e) {
    toast.error(e.message || 'Fehler beim Ändern der Rolle')
  }
}

// ── Delete User ──
async function handleDelete(userDoc) {
  if (isCurrentUser(userDoc)) return
  const ok = await confirm.ask(`${[userDoc.vorname, userDoc.nachname].filter(Boolean).join(' ') || userDoc.email} wirklich entfernen?`)
  if (!ok) return
  try {
    await usersStore.deleteUser(userDoc.$id)
    toast.success('Benutzer entfernt')
  } catch (e) {
    toast.error(e.message || 'Fehler beim Löschen')
  }
}

// ── Roles CRUD ──
function openNewRole() {
  editRoleId.value = null
  roleForm.value = { name: '', istAdmin: false, berechtigungen: [], sortierung: rollenStore.rollen.length * 10 }
  showRoleDialog.value = true
}

function openEditRole(rolle) {
  editRoleId.value = rolle.$id
  roleForm.value = {
    name: rolle.name,
    istAdmin: rolle.istAdmin || false,
    berechtigungen: [...(rolle.berechtigungen || [])],
    sortierung: rolle.sortierung || 0,
  }
  showRoleDialog.value = true
}

async function submitRole() {
  if (!roleForm.value.name) return
  roleLoading.value = true
  try {
    if (editRoleId.value) {
      await rollenStore.updateRolle(editRoleId.value, roleForm.value)
      toast.success('Rolle aktualisiert')
    } else {
      await rollenStore.createRolle(roleForm.value)
      toast.success('Rolle erstellt')
    }
    showRoleDialog.value = false
  } catch (e) {
    toast.error(e.message || 'Fehler')
  } finally {
    roleLoading.value = false
  }
}

async function handleDeleteRole(rolle) {
  const ok = await confirm.ask(`Rolle "${rolle.name}" wirklich löschen?`)
  if (!ok) return
  try {
    await rollenStore.deleteRolle(rolle.$id)
    toast.success('Rolle gelöscht')
  } catch (e) {
    toast.error(e.message || 'Fehler beim Löschen')
  }
}

function togglePermission(perm) {
  const idx = roleForm.value.berechtigungen.indexOf(perm)
  if (idx === -1) {
    roleForm.value.berechtigungen.push(perm)
  } else {
    roleForm.value.berechtigungen.splice(idx, 1)
  }
}

// ── Tab State ──
const tab = ref('users')
</script>

<template>
  <div>
    <PageHeader title="Benutzer & Rollen" subtitle="Benutzer einladen, Rollen und Berechtigungen verwalten">
      <template #actions>
        <v-btn
          v-if="tab === 'users'"
          color="primary"
          variant="flat"
          size="small"
          prepend-icon="mdi-account-plus-outline"
          @click="openInvite"
        >
          Einladen
        </v-btn>
        <v-btn
          v-if="tab === 'rollen'"
          color="primary"
          variant="flat"
          size="small"
          prepend-icon="mdi-plus"
          @click="openNewRole"
        >
          Neue Rolle
        </v-btn>
      </template>
    </PageHeader>

    <div class="uv-content">
      <v-tabs v-model="tab" density="compact" class="mb-4">
        <v-tab value="users">Benutzer</v-tab>
        <v-tab value="rollen">Rollen</v-tab>
      </v-tabs>

      <LoadingState v-if="loading" />

      <!-- ═══ Users Tab ═══ -->
      <template v-else-if="tab === 'users'">
        <v-text-field
          v-model="search"
          placeholder="Suchen…"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          variant="outlined"
          hide-details
          class="mb-4"
          style="max-width: 320px"
        />

        <v-card variant="outlined">
          <v-table density="compact">
            <thead>
              <tr>
                <th>Nachname</th>
                <th>Vorname</th>
                <th>E-Mail</th>
                <th>Rolle</th>
                <th style="width: 100px" />
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in filteredUsers" :key="u.$id">
                <td class="font-weight-medium">
                  {{ u.nachname || '—' }}
                  <v-chip v-if="isCurrentUser(u)" size="x-small" color="primary" variant="tonal" class="ml-2">Du</v-chip>
                </td>
                <td>{{ u.vorname || '—' }}</td>
                <td class="text-medium-emphasis">{{ u.email }}</td>
                <td>
                  <v-chip size="small" variant="tonal" @click="openChangeRole(u)" style="cursor: pointer">
                    {{ getRolleName(u.rolle) }}
                    <v-icon icon="mdi-pencil-outline" size="12" class="ml-1" />
                  </v-chip>
                </td>
                <td class="text-right">
                  <v-btn
                    v-if="!isCurrentUser(u)"
                    icon="mdi-delete-outline"
                    size="x-small"
                    variant="text"
                    color="error"
                    @click="handleDelete(u)"
                  />
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="5" class="text-center text-medium-emphasis pa-6">
                  Keine Benutzer gefunden.
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </template>

      <!-- ═══ Rollen Tab ═══ -->
      <template v-else-if="tab === 'rollen'">
        <v-card variant="outlined">
          <v-table density="compact">
            <thead>
              <tr>
                <th>Name</th>
                <th>Typ</th>
                <th>Berechtigungen</th>
                <th style="width: 100px" />
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in rollenStore.rollen" :key="r.$id">
                <td class="font-weight-medium">{{ r.name }}</td>
                <td>
                  <v-chip v-if="r.istAdmin" size="small" color="warning" variant="tonal">Admin</v-chip>
                  <span v-else class="text-medium-emphasis">Eingeschränkt</span>
                </td>
                <td>
                  <template v-if="r.istAdmin">
                    <span class="text-medium-emphasis">Vollzugriff</span>
                  </template>
                  <template v-else>
                    <v-chip
                      v-for="perm in (r.berechtigungen || []).slice(0, 4)"
                      :key="perm"
                      size="x-small"
                      variant="tonal"
                      class="mr-1"
                    >
                      {{ perm }}
                    </v-chip>
                    <span v-if="(r.berechtigungen || []).length > 4" class="text-medium-emphasis text-caption">
                      +{{ r.berechtigungen.length - 4 }}
                    </span>
                  </template>
                </td>
                <td class="text-right">
                  <v-btn icon="mdi-pencil-outline" size="x-small" variant="text" @click="openEditRole(r)" />
                  <v-btn icon="mdi-delete-outline" size="x-small" variant="text" color="error" @click="handleDeleteRole(r)" />
                </td>
              </tr>
              <tr v-if="rollenStore.rollen.length === 0">
                <td colspan="4" class="text-center text-medium-emphasis pa-6">
                  Noch keine Rollen angelegt.
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </template>
    </div>

    <!-- ═══ Invite Dialog ═══ -->
    <v-dialog v-model="showInvite" max-width="440">
      <v-card>
        <v-card-title class="text-body-1 font-weight-bold">Benutzer einladen</v-card-title>
        <v-card-text>
          <v-text-field v-model="inviteForm.vorname" label="Vorname" density="compact" class="mb-3" hide-details />
          <v-text-field v-model="inviteForm.nachname" label="Nachname" density="compact" class="mb-3" hide-details />
          <v-text-field v-model="inviteForm.email" label="E-Mail" type="email" density="compact" class="mb-3" hide-details />
          <v-select
            v-model="inviteForm.rolle"
            :items="rollenStore.rollen"
            item-title="name"
            item-value="$id"
            label="Rolle"
            density="compact"
            hide-details
            clearable
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showInvite = false">Abbrechen</v-btn>
          <v-btn color="primary" variant="flat" :loading="inviteLoading" @click="submitInvite">Einladen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ═══ Change Role Dialog ═══ -->
    <v-dialog v-model="showChangeRole" max-width="380">
      <v-card>
        <v-card-title class="text-body-1 font-weight-bold">Rolle ändern</v-card-title>
        <v-card-text>
          <p class="text-body-2 text-medium-emphasis mb-3">
            {{ [changeRoleUser?.vorname, changeRoleUser?.nachname].filter(Boolean).join(' ') || changeRoleUser?.email }}
          </p>
          <v-select
            v-model="changeRoleValue"
            :items="rollenStore.rollen"
            item-title="name"
            item-value="$id"
            label="Rolle"
            density="compact"
            hide-details
            clearable
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showChangeRole = false">Abbrechen</v-btn>
          <v-btn color="primary" variant="flat" @click="submitChangeRole">Speichern</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ═══ Role Edit Dialog ═══ -->
    <v-dialog v-model="showRoleDialog" max-width="520">
      <v-card>
        <v-card-title class="text-body-1 font-weight-bold">
          {{ editRoleId ? 'Rolle bearbeiten' : 'Neue Rolle' }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="roleForm.name" label="Name" density="compact" class="mb-3" hide-details />
          <v-switch v-model="roleForm.istAdmin" label="Admin (Vollzugriff)" density="compact" color="primary" hide-details class="mb-4" />

          <template v-if="!roleForm.istAdmin">
            <p class="text-body-2 font-weight-bold mb-2">Berechtigungen</p>
            <div v-for="(mod, key) in MODULES" :key="key" class="uv-perm-module">
              <span class="text-body-2 font-weight-medium">{{ mod.label }}</span>
              <div class="uv-perm-actions">
                <v-checkbox
                  v-for="action in mod.actions"
                  :key="`${key}:${action}`"
                  :label="ACTION_LABELS[action] || action"
                  :model-value="roleForm.berechtigungen.includes(`${key}:${action}`)"
                  @update:model-value="togglePermission(`${key}:${action}`)"
                  density="compact"
                  hide-details
                  color="primary"
                />
              </div>
            </div>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showRoleDialog = false">Abbrechen</v-btn>
          <v-btn color="primary" variant="flat" :loading="roleLoading" @click="submitRole">
            {{ editRoleId ? 'Speichern' : 'Erstellen' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.uv-content {
  padding: 0 var(--aw-space-lg) var(--aw-space-lg);
}

.uv-perm-module {
  display: flex;
  align-items: center;
  gap: var(--aw-space-md);
  padding: var(--aw-space-xs) 0;
  border-bottom: 1px solid var(--aw-border);
}

.uv-perm-module:last-child {
  border-bottom: none;
}

.uv-perm-actions {
  display: flex;
  gap: var(--aw-space-sm);
  margin-left: auto;
}
</style>
