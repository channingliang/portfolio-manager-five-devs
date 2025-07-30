<script setup>
import { ref, computed, onMounted } from "vue";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import api from "@/lib/request.js";
import { useAccountStore } from "@/stores/account.js";

const transactionHistory = ref([]);

// 查询交易历史（标准api调用）
const fetchTransactions = () => {
  api
    .get("/cash", { account_id: 3 })
    .then((res) => {
      transactionHistory.value = Array.isArray(res) ? res : [];
    })
    .catch((error) => {
      transactionHistory.value = [];
      console.error(error);
    });
};

onMounted(fetchTransactions);

// 获取余额
const currentBalance = computed(() => {
  const balance = useAccountStore().balance;
  return balance ?? "/";
});
const formattedBalance = computed(() => {
  if (currentBalance.value === "/") return currentBalance.value;
  return `$${Number(currentBalance.value).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
});

// 日期格式化
const formatDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};
</script>

<template>
  <div class="h-full overflow-y-auto rounded-2xl border">
    <div
      class="sticky top-0 z-888 w-full rounded-t-2xl bg-white/90 p-4 shadow-lg"
    >
      <p>Transactions</p>
      <div class="mt-2 text-xl">
        {{ formattedBalance }}
      </div>
    </div>

    <div class="overflow-x-hidden overflow-y-auto">
      <Accordion type="single" collapsible>
        <template v-if="transactionHistory.length > 0">
          <AccordionItem
            v-for="(transaction, idx) in transactionHistory"
            :key="transaction.occurred_at + '-' + idx"
            :value="String(idx)"
          >
            <AccordionTrigger
              class="flex w-full items-center px-4 py-3 font-medium"
            >
              <div class="flex-1 text-left">
                <span
                  class="text-nowrap"
                  :class="
                    transaction.type === 1 ? 'text-green-600' : 'text-red-600'
                  "
                >
                  {{ transaction.type === 1 ? "+" : "-" }}${{
                    Number(transaction.amount).toFixed(2)
                  }}
                </span>
              </div>
              <div class="min-w-[140px] text-right text-sm text-gray-500">
                {{ formatDate(transaction.occurred_at) }}
              </div>
            </AccordionTrigger>
            <AccordionContent class="px-4 pt-0 pb-3 text-gray-600">
              {{ transaction.description || "No description." }}
            </AccordionContent>
          </AccordionItem>
        </template>
        <template v-else>
          <AccordionItem value="empty">
            <AccordionTrigger disabled class="text-gray-400"
              >No transaction history found</AccordionTrigger
            >
          </AccordionItem>
        </template>
      </Accordion>
    </div>
  </div>
</template>
