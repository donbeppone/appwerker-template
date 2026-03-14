<script setup>
import { useConfirmStore } from '@/stores/confirm.js'

const confirm = useConfirmStore()
</script>

<template>
  <v-dialog v-model="confirm.visible" max-width="420" persistent>
    <v-card>
      <v-card-title class="d-flex align-center gap-2 pt-4">
        <v-icon color="warning">mdi-alert-circle-outline</v-icon>
        {{ confirm.header }}
      </v-card-title>

      <v-card-text class="text-body-1">
        {{ confirm.message }}
      </v-card-text>

      <v-card-actions class="pa-4 pt-0">
        <v-spacer />
        <v-btn
          variant="text"
          @click="confirm.reject()"
        >
          {{ confirm.rejectLabel }}
        </v-btn>
        <v-btn
          :color="confirm.acceptColor"
          variant="flat"
          @click="confirm.accept()"
        >
          {{ confirm.acceptLabel }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
