<script setup>
import { ref, computed } from "vue";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { CheckCircle } from "lucide-vue-next";
import { DrawerClose } from "@/components/ui/drawer/index.js";

const amount = ref(0);
const paymentMethod = ref("");
const step = ref(0); // 当前 CarouselItem 索引

const canProceedStep1 = computed(() => amount.value > 0);
const canProceedStep2 = computed(() => paymentMethod.value !== "");

const carouselRef = ref(null);

const goNextStep = () => {
  if (carouselRef.value) {
    carouselRef.value.next();
    step.value++;
  }
};

const pay = () => {
  goNextStep();
};

const closeDrawer = () => {
  const drawer = document.querySelector("[data-state=open]");
  if (drawer) {
    // 假设 Drawer 提供了这种关闭方式，否则通过 v-model 控制可见性
    drawer.click();
  }
};
</script>

<template>
  <Drawer>
    <DrawerTrigger as-child>
      <Button variant="outline"> Open Drawer </Button>
    </DrawerTrigger>
    <DrawerContent>
      <div class="mx-auto w-full max-w-sm pb-6">
        <DrawerHeader>
          <DrawerTitle>Deposit</DrawerTitle>
          <DrawerDescription>
            Add money to your account to get started!
          </DrawerDescription>
        </DrawerHeader>
        <div class="p-4 pb-0">
          <div class="flex items-center justify-center space-x-2">
            <Carousel class="relative w-full max-w-xs">
              <CarouselContent>
                <!-- Step 1: 输入金额 -->
                <CarouselItem key="amount">
                  <div class="p-1">
                    <Card class="h-auto">
                      <CardHeader>
                        <span class="text-sm font-semibold">
                          How much would you like to deposit?
                        </span>
                      </CardHeader>
                      <CardContent
                        class="flex flex-col items-center justify-center space-y-4 p-6"
                      >
                        <NumberField
                          class="w-full"
                          id="balance"
                          v-model="amount"
                          :format-options="{
                            style: 'currency',
                            currency: 'USD',
                            currencyDisplay: 'code',
                            currencySign: 'accounting',
                          }"
                        >
                          <NumberFieldContent>
                            <NumberFieldDecrement />
                            <NumberFieldInput />
                            <NumberFieldIncrement />
                          </NumberFieldContent>
                        </NumberField>
                        <CarouselNext :disabled="!canProceedStep1" />
                        <Button
                          :disabled="!canProceedStep1"
                          @click="goNextStep"
                          class="w-full"
                        >
                          Next
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>

                <!-- Step 2: 选择支付方式 -->
                <CarouselItem key="payment">
                  <div class="p-1">
                    <Card class="h-auto">
                      <CardHeader>
                        <span class="text-sm font-semibold">
                          Choose your payment method
                        </span>
                      </CardHeader>
                      <CardContent
                        class="flex flex-col items-center justify-center space-y-4 p-6"
                      >
                        <Select v-model="paymentMethod">
                          <SelectTrigger class="w-[180px]">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="virtual-account">
                                Virtual Account
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <Button
                          :disabled="!canProceedStep2"
                          @click="pay"
                          class="w-full"
                        >
                          Pay
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>

                <!-- Step 3: 支付完成 -->
                <CarouselItem key="success">
                  <div class="p-1">
                    <Card class="h-auto">
                      <CardHeader class="flex flex-col items-center">
                        <CheckCircle class="h-12 w-12 text-green-500" />
                        <span class="mt-2 text-sm font-semibold">
                          Payment Successful!
                        </span>
                      </CardHeader>
                      <CardContent class="flex items-center justify-center p-6">
                        <DrawerClose>
                          <Button variant="outline"> Complete </Button>
                        </DrawerClose>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </DrawerContent>
  </Drawer>
</template>
