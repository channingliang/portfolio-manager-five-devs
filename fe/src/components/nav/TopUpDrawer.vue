<script setup>
import { ref, computed, watch } from "vue";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const props = defineProps({
  open: Boolean,
});
const emit = defineEmits(["update:open"]);

// 建议用 computed 的 getter/setter 做真正的 v-model 代理
const modelValue = computed({
  get: () => props.open,
  set: (val) => emit("update:open", val),
});

function closeDrawer() {
  modelValue.value = false;
}

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
import { Check, Loader2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button/index.js";

const STEP1 = "step-1";
const STEP2 = "step-2";
const STEP3 = "step-3";

const accordionValue = ref(STEP1);

const topupAmount = ref(1500);
const step1ConfirmedValue = ref(topupAmount.value); // 记录上次确认金额
const step1Completed = ref(false);

const selectedPayment = ref("");
const step2ConfirmedValue = ref(""); // 记录上次确认支付方式
const step2Completed = ref(false);

const paymentLoading = ref(false);
const isPaymentSuccess = ref(false);

const paymentMethods = [{ value: "virtual", label: "Virtual Payment" }];

// 校验逻辑
const isStep1Invalid = computed(
  () =>
    !topupAmount.value ||
    isNaN(topupAmount.value) ||
    Number(topupAmount.value) <= 0,
);
const isStep2Invalid = computed(() => !selectedPayment.value);

// trigger文本
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

const step3Text = computed(() =>
  step2Completed.value ? "Payment Success" : "Payment Status",
);

// 动态控制每个栏的enable/disable
const isStep1Disabled = computed(() => step2Completed.value);
const isStep2Disabled = computed(() => {
  // payment完成后disable
  if (step2Completed.value) return true;
  // 金额未确认或金额被修改，disable
  return (
    !step1Completed.value || topupAmount.value !== step1ConfirmedValue.value
  );
});
const isStep3Disabled = computed(() => !step2Completed.value);

// 若第一栏金额被修改，则自动收起第二栏并disable
watch(topupAmount, (val) => {
  // 金额未被确认 或者 已经支付完成时忽略
  if (!step1Completed.value || step2Completed.value) return;
  if (val !== step1ConfirmedValue.value) {
    // 撤销step1完成状态，锁死step2，并且自动收起step2
    step1Completed.value = false;
    selectedPayment.value = "";
    step2ConfirmedValue.value = "";
    step2Completed.value = false;
    if (accordionValue.value === STEP2) accordionValue.value = STEP1;
  }
});

// 点击金额确认
function handleAmountConfirm() {
  if (!isStep1Invalid.value) {
    step1ConfirmedValue.value = topupAmount.value;
    step1Completed.value = true;
    // 解锁step2
    accordionValue.value = STEP2;
  }
}

// 点击支付方式确认
function handlePaymentConfirm() {
  if (!isStep2Invalid.value) {
    step2ConfirmedValue.value = selectedPayment.value;
    step2Completed.value = true;
    paymentLoading.value = true;
    // 跳到step3
    accordionValue.value = STEP3;
  }
}

// 监听进入step3显示loading
watch(
  () => accordionValue.value,
  (val) => {
    if (val === STEP3 && step2Completed.value) {
      paymentLoading.value = true;
      setTimeout(() => {
        paymentLoading.value = false;
        isPaymentSuccess.value = true;
      }, 2000);
    }
  },
);

// 重置函数，重置所有状态
function resetAll() {
  accordionValue.value = STEP1;
  topupAmount.value = 1500;
  step1ConfirmedValue.value = 1500;
  step1Completed.value = false;
  selectedPayment.value = "";
  step2ConfirmedValue.value = "";
  step2Completed.value = false;
  paymentLoading.value = false;
  isPaymentSuccess.value = false;
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
      <div class="mx-auto w-[1000px] max-w-sm border pb-6">
        <DrawerHeader>
          <DrawerTitle>Deposit</DrawerTitle>
          <DrawerDescription>
            Add money to your account to get started!
          </DrawerDescription>
        </DrawerHeader>
        <div class="p-4 pb-8">
          <Accordion
            type="single"
            class="mx-auto w-full max-w-md rounded-2xl bg-white p-4 shadow-lg"
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
                      currency: 'EUR',
                      currencyDisplay: 'code',
                      currencySign: 'accounting',
                    }"
                    class="w-full"
                    :disabled="step2Completed"
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
                    :disabled="isStep1Invalid || step1Completed"
                  >
                    <Check class="h-4 w-4" />
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            <!-- Step 2 -->
            <AccordionItem :value="STEP2" :disabled="isStep2Disabled">
              <AccordionTrigger>
                <span class="flex items-center gap-2">
                  <Check v-if="step2Completed" class="h-5 w-5 text-green-500" />
                  {{ step2Text }}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div class="flex items-center justify-between space-x-4 py-2">
                  <Select v-model="selectedPayment" :disabled="step2Completed">
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
                    :disabled="isStep2Invalid || step2Completed"
                  >
                    <Check class="h-4 w-4" />
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            <!-- Step 3 -->
            <AccordionItem
              :value="STEP3"
              :disabled="isStep3Disabled || isPaymentSuccess"
            >
              <AccordionTrigger>
                <span class="flex items-center gap-2">
                  {{ step3Text }}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div class="flex min-h-[140px] flex-col items-center py-8">
                  <template v-if="paymentLoading">
                    <Loader2
                      class="mb-2 h-10 w-10 animate-spin text-blue-500"
                    />
                    <div class="text-base text-blue-500">
                      Processing your payment...
                    </div>
                  </template>
                  <template v-else>
                    <Check class="mb-2 h-16 w-16 text-green-500" />
                    <div class="mb-2 text-xl font-semibold text-green-600">
                      Top-up Successful!
                    </div>
                    <div class="text-gray-500">
                      You have successfully added ${{ topupAmount }} to your
                      wallet.
                    </div>
                    <Button variant="outline" @click="closeDrawer"
                      >Complete</Button
                    >
                  </template>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </DrawerContent>
  </Drawer>
</template>
