<script setup>
import { useAccountStore } from "@/stores/account.js";
import { Button } from "@/components/ui/button/index.js";

const accountStore = useAccountStore();

const updateBalance = () => {
  accountStore.setBalance(9999999.99);
};
</script>

<template>
  <div>
    This is Fund page
    <Button @click="updateBalance">Update</Button>
  </div>
</template>
