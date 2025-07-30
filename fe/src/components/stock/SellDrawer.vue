<script setup>
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-vue-next";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import { Checkbox } from "@/components/ui/checkbox";
import { ref, watch, computed } from "vue";

const props = defineProps({
  open: { type: Boolean, required: true },
  stock: { type: Object, required: true },
  holding: { type: Number, required: true }, // 当前持有数量
  defaultQuantity: { type: Number, default: 1 },
  defaultPrice: { type: Number, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: "" },
});
const emit = defineEmits(["update:open", "confirm", "cancel"]);

const drawerOpen = computed({
  get: () => props.open,
  set: (val) => emit("update:open", val),
});

const sellQuantity = ref(props.defaultQuantity);
const sellPrice = ref(
  props.defaultPrice ?? (props.stock?.price ? Number(props.stock.price) : 0),
);

const isMarketOrder = ref(false);
const marketPriceSnapshot = ref(
  props.stock?.price ?? props.stock?.price_per_unit ?? props.defaultPrice ?? 0,
);

// 初始化和弹窗重新打开都赋值
watch([() => props.open, () => props.stock], ([open]) => {
  if (open) {
    sellQuantity.value = props.defaultQuantity;
    sellPrice.value =
      props.defaultPrice ??
      (props.stock?.price ? Number(props.stock.price) : 0);
    isMarketOrder.value = false;
    marketPriceSnapshot.value =
      props.stock?.price ??
      props.stock?.price_per_unit ??
      props.defaultPrice ??
      Number(sellPrice.value);
  }
});

const totalIncome = computed(
  () =>
    Number(sellQuantity.value) *
      (isMarketOrder.value
        ? Number(marketPriceSnapshot.value)
        : Number(sellPrice.value)) || 0,
);
const insufficientHolding = computed(
  () => Number(sellQuantity.value) > Number(props.holding),
);

const canSell = computed(
  () =>
    !props.loading &&
    Number(sellQuantity.value) > 0 &&
    (isMarketOrder.value || Number(sellPrice.value) > 0) &&
    !insufficientHolding.value,
);

const handleConfirm = () => {
  emit("confirm", {
    quantity: Number(sellQuantity.value),
    price: isMarketOrder.value
      ? Number(marketPriceSnapshot.value)
      : Number(sellPrice.value),
    stock: props.stock,
    market: isMarketOrder.value,
  });
};
const handleCancel = () => {
  emit("update:open", false);
  emit("cancel");
};
</script>

<template>
  <Drawer v-model:open="drawerOpen">
    <DrawerContent>
      <div class="mx-auto h-full max-w-md min-w-[320px] pt-8 pb-16">
        <DrawerHeader>
          <DrawerTitle>
            Sell {{ props.stock?.name }} ({{ props.stock?.ticker }})
          </DrawerTitle>
          <DrawerDescription>
            Sell your holding at your desired price or at market price.
          </DrawerDescription>
        </DrawerHeader>
        <div class="px-4">
          <div class="mx-auto mt-2 w-full rounded-2xl bg-white p-6 shadow-lg">
            <div class="mb-4">
              <span class="mb-1 block text-sm font-medium text-gray-700"
                >Quantity</span
              >
              <NumberField
                v-model="sellQuantity"
                :min="1"
                :step="1"
                :disabled="props.loading"
                class="w-full"
              >
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <NumberFieldInput />
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>
            </div>
            <div class="mb-2">
              <span class="mb-1 block text-sm font-medium text-gray-700"
                >Sell Price</span
              >
              <NumberField
                v-model="sellPrice"
                :min="0"
                :step="0.01"
                :format-options="{
                  style: 'currency',
                  currency: 'USD',
                  currencyDisplay: 'code',
                  minimumFractionDigits: 2,
                }"
                :disabled="props.loading || isMarketOrder"
                class="w-full"
              >
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <NumberFieldInput />
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>
            </div>

            <div class="mt-4 flex items-center gap-x-2">
              <Checkbox
                :id="'market-order-sell'"
                v-model:modelValue="isMarketOrder"
              />
              <label
                for="market-order-sell"
                class="cursor-pointer text-sm font-medium select-none"
              >
                Sell at market price
              </label>
            </div>

            <div class="mt-4 text-end text-xs text-gray-500">
              <p class="mb-1">
                Total: ${{
                  totalIncome.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })
                }}
              </p>
              <p>Holding: {{ props.holding }}</p>
            </div>
            <div
              v-if="insufficientHolding"
              class="mt-1 text-end text-xs text-red-500"
            >
              Not enough holding quantity
            </div>
            <div v-if="props.error" class="mt-2 text-end text-sm text-red-500">
              {{ props.error }}
            </div>
            <div class="mt-4 flex justify-end gap-2">
              <DrawerClose as-child>
                <Button
                  size="icon"
                  variant="outline"
                  :disabled="props.loading"
                  @click="handleCancel"
                >
                  <X class="size-4 text-red-500" />
                </Button>
              </DrawerClose>
              <Button
                class="flex items-center gap-1"
                size="icon"
                variant="outline"
                @click="handleConfirm"
                :disabled="!canSell"
              >
                <Loader2 v-if="props.loading" class="h-4 w-4 animate-spin" />
                <Check v-else class="size-4 text-green-500" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DrawerContent>
  </Drawer>
</template>
