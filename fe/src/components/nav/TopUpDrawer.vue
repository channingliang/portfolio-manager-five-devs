<script setup>
import { ref, computed, watch } from "vue";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useAccountStore } from "@/stores/account.js";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Loader2, X } from "lucide-vue-next";
import { Button } from "@/components/ui/button/index.js";
import api from "@/lib/request.js";

const props = defineProps({
  open: Boolean,
});
const emit = defineEmits(["update:open"]);

const accountStore = useAccountStore();

// v-model代理
const modelValue = computed({
  get: () => props.open,
  set: (val) => emit("update:open", val),
});

function closeDrawer() {
  modelValue.value = false;
}

const STEP1 = "step-1";
const STEP2 = "step-2";
const STEP3 = "step-3"; // processing
const STEP4 = "step-4"; // result

const accordionValue = ref(STEP1);

const topupAmount = ref(1000);
const step1ConfirmedValue = ref(topupAmount.value);
const step1Completed = ref(false);

const selectedPayment = ref("");
const step2ConfirmedValue = ref("");
const step2Completed = ref(false);

const processing = ref(false); // Step 3 loading
const processDone = ref(false); // Step 3结束标志

const apiResult = ref(null); // null = 未请求，true = 成功，false = 失败
const processMessage = ref(""); // 错误/成功消息

const paymentMethods = [{ value: "virtual", label: "Virtual Payment" }];

// 校验逻辑
const isStep1Invalid = computed(
  () =>
    !topupAmount.value ||
    isNaN(topupAmount.value) ||
    Number(topupAmount.value) <= 0,
);
const isStep2Invalid = computed(() => !selectedPayment.value);

const step1Text = computed(() =>
  step1Completed.value
    ? `Top-up Amount: €${Number(step1ConfirmedValue.value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
    : "Enter Top-up Amount",
);

const step2Text = computed(() => {
  if (!step1Completed.value) return "Select Payment Method";
  const selected = paymentMethods.find(
    (m) => m.value === step2ConfirmedValue.value,
  );
  return step2Completed.value && selected
    ? `Payment Method: ${selected.label}`
    : "Select Payment Method";
});

const step3Text = computed(() => {
  if (accordionValue.value === STEP4 || processDone.value) {
    return "Process finished";
  }
  return "Request process";
});

const step4Text = computed(() => {
  if (apiResult.value === true) return "Success";
  if (apiResult.value === false) return "Failed";
  return "Result";
});

// 动态enable/disable
const isStep1Disabled = computed(
  () => step2Completed.value || processing.value || processDone.value,
);
const isStep2Disabled = computed(() => {
  if (step2Completed.value || processing.value || processDone.value)
    return true;
  return (
    !step1Completed.value || topupAmount.value !== step1ConfirmedValue.value
  );
});

const isStep3Disabled = computed(() => !processing.value);
const isStep4Disabled = computed(() => !processDone.value);

// 修改金额自动重置
watch(topupAmount, (val) => {
  if (!step1Completed.value || processing.value || processDone.value) return;
  if (val !== step1ConfirmedValue.value) {
    step1Completed.value = false;
    selectedPayment.value = "";
    step2ConfirmedValue.value = "";
    step2Completed.value = false;
    if (
      accordionValue.value === STEP2 ||
      accordionValue.value === STEP3 ||
      accordionValue.value === STEP4
    ) {
      accordionValue.value = STEP1;
    }
  }
});

// 点击金额确认
function handleAmountConfirm() {
  if (!isStep1Invalid.value) {
    step1ConfirmedValue.value = topupAmount.value;
    step1Completed.value = true;
    accordionValue.value = STEP2;
  }
}

// 支付
async function handlePaymentConfirm() {
  if (!isStep2Invalid.value) {
    step2ConfirmedValue.value = selectedPayment.value;
    step2Completed.value = true;

    // 跳到 processing 栏
    accordionValue.value = STEP3;
    processing.value = true;
    processDone.value = false;
    apiResult.value = null;
    processMessage.value = "";

    // 1. Promise for API
    const requestPromise = api
      .post("/cash/deposit", {
        account_id: 3,
        type: 1,
        amount: topupAmount.value,
        description: "Top-up via Virtual Payment",
      })
      .then((res) => {
        accountStore.setBalance(res.current_balance);
        apiResult.value = true;
        processMessage.value = "Your deposit was successful!";
      })
      .catch((e) => {
        apiResult.value = false;
        processMessage.value =
          e?.message || "Deposit failed due to a network error.";
      });

    // 2. Promise for minimum loading time (1s)
    const minLoadingPromise = new Promise((resolve) =>
      setTimeout(resolve, 1000),
    );

    // 3. 等待两个都完成后才结束 loading
    await Promise.all([requestPromise, minLoadingPromise]);
    processing.value = false;
    processDone.value = true;
    // 自动展开 result 栏
    accordionValue.value = STEP4;
  }
}

// 重置所有
function resetAll() {
  accordionValue.value = STEP1;
  topupAmount.value = 1500;
  step1ConfirmedValue.value = 1500;
  step1Completed.value = false;
  selectedPayment.value = "";
  step2ConfirmedValue.value = "";
  step2Completed.value = false;
  processing.value = false;
  processDone.value = false;
  apiResult.value = null;
  processMessage.value = "";
}

// 监听drawer关闭，自动重置
watch(
  () => props.open,
  (val) => {
    if (!val) {
      resetAll();
    }
  },
);
</script>

<template>
  <Drawer v-model:open="modelValue">
    <DrawerContent>
      <div class="mx-auto h-full min-w-2xl pt-8 pb-16">
        <DrawerHeader>
          <DrawerTitle>Top Up</DrawerTitle>
          <DrawerDescription>
            Add funds to your account to start trading and investing.{{
              isStep3Disabled
            }}
          </DrawerDescription>
        </DrawerHeader>
        <div class="px-4">
          <Accordion
            type="single"
            class="mx-auto w-full rounded-2xl bg-white p-4 shadow-lg"
            collapsible
            v-model="accordionValue"
          >
            <!-- Step 1 -->
            <AccordionItem :value="STEP1" :disabled="isStep1Disabled">
              <AccordionTrigger>
                <span class="flex items-center gap-2">
                  <Check v-if="step1Completed" class="h-5 w-5 text-green-500" />
                  {{ step1Text }}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div class="flex items-center justify-between space-x-4 py-2">
                  <NumberField
                    id="balance"
                    v-model="topupAmount"
                    :format-options="{
                      style: 'currency',
                      currency: 'USD',
                      currencyDisplay: 'code',
                      currencySign: 'accounting',
                      maximumFractionDigits: 2,
                    }"
                    step="0.01"
                    class="w-full"
                    :disabled="step2Completed || processing || processDone"
                  >
                    <NumberFieldContent>
                      <NumberFieldDecrement />
                      <NumberFieldInput />
                      <NumberFieldIncrement />
                    </NumberFieldContent>
                  </NumberField>
                  <Button
                    variant="outline"
                    size="icon"
                    @click="handleAmountConfirm"
                    :disabled="
                      isStep1Invalid ||
                      step1Completed ||
                      processing ||
                      processDone
                    "
                  >
                    <Check class="size-4 text-green-500" />
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            <!-- Step 2 -->
            <AccordionItem :value="STEP2" :disabled="isStep2Disabled">
              <AccordionTrigger>
                <span class="flex items-center gap-2">
                  <Check v-if="step2Completed" class="size-4 text-green-500" />
                  {{ step2Text }}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div class="flex items-center justify-between space-x-4 py-2">
                  <Select
                    v-model="selectedPayment"
                    :disabled="step2Completed || processing || processDone"
                  >
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="not selected" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          v-for="method in paymentMethods"
                          :key="method.value"
                          :value="method.value"
                        >
                          {{ method.label }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    @click="handlePaymentConfirm"
                    :disabled="
                      isStep2Invalid ||
                      step2Completed ||
                      processing ||
                      processDone
                    "
                  >
                    <Check class="size-4 text-green-500" />
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            <!-- Step 3: Processing -->
            <AccordionItem :value="STEP3" :disabled="isStep3Disabled">
              <AccordionTrigger>
                <span class="flex items-center gap-2">
                  {{ step3Text }}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div
                  class="flex min-h-[120px] flex-col items-center justify-center py-8"
                >
                  <Loader2 class="mb-2 h-10 w-10 animate-spin text-blue-500" />
                  <div>Please wait while we process your request...</div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <!-- Step 4: Result -->
            <AccordionItem :value="STEP4" :disabled="isStep4Disabled">
              <AccordionTrigger>
                <span class="flex items-center gap-2">
                  <template v-if="apiResult === true">
                    <Check class="h-5 w-5 text-green-500" />
                  </template>
                  <template v-else-if="apiResult === false">
                    <X class="h-5 w-5 text-red-500" />
                  </template>
                  {{ step4Text }}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div
                  class="flex min-h-[80px] flex-col items-center justify-center py-2"
                >
                  <template v-if="apiResult === true">
                    <div class="mb-2 text-xl font-semibold text-green-600">
                      Top Up Successful!
                    </div>
                    <div class="text-gray-500">
                      You have added
                      <span class="font-black">${{ topupAmount }}</span> to your
                      wallet
                    </div>
                  </template>
                  <template v-else-if="apiResult === false">
                    <div class="mb-2 text-xl font-semibold text-red-600">
                      Top Up Failed
                    </div>
                    <div class="text-gray-500">
                      {{ processMessage }}
                    </div>
                  </template>
                  <Button
                    class="mt-4 w-24"
                    variant="outline"
                    @click="closeDrawer"
                  >
                    Done
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </DrawerContent>
  </Drawer>
</template>
