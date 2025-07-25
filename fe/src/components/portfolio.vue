<template>
<!-- 投资资产卡片 -->
  <div class="medium">
    <h3 class="text-lg font-bold text-primary mb-4 flex items-center">
      <span class="iconify mr-2" data-icon="material-symbols:currency-exchange"></span>
      投资资产
    </h3>
    <div class="text-3xl font-bold mb-4">￥10,000,000</div>
                        
                        <div class="mb-6">
                            <h4 class="font-medium text-gray-600 mb-3">持仓产品</h4>
                            <div class="grid grid-cols-2 gap-4">

                                <!-- 持仓产品卡片1 -->
                                 <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow group relative">
                                    <div class="flex justify-between">
                                        <div class="font-medium">产品名称：</div>
                                        <div class="profit font-mono text-sm">收益率：+5.0%</div>
                                    </div>
                                    <div class="font-mono text-xl mt-2">市值：￥</div>
                                    
                                    <!-- Hover时显示的详情层 -->
                                    <div class="hidden group-hover:block absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-2 p-4 z-10 border">
                                        <table class="text-xs w-full">
                                            <tbody><tr>
                                                <td class="py-1 text-gray-500">最新净值</td>
                                                <td class="py-1 font-mono">3.2567</td>
                                            </tr>
                                            <tr>
                                                <td class="py-1 text-gray-500">持有份额</td>
                                                <td class="py-1 font-mono">129,857.25</td>
                                            </tr>
                                            <tr>
                                                <td class="py-1 text-gray-500">年化收益</td>
                                                <td class="py-1 font-mono profit">12.15%</td>
                                            </tr>
                                        </tbody></table>
                                    </div>
                                </div>

                                <!-- 持仓产品卡片2 -->
                                <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow group relative">
                                    <div class="flex justify-between">
                                        <div class="font-medium">产品名称：</div>
                                        <div class="loss font-mono text-sm">收益率：-5.0%</div>
                                    </div>
                                    <div class="font-mono text-xl mt-2">市值：￥</div>
                                    
                                    <div class="hidden group-hover:block absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-2 p-4 z-10 border">
                                        <table class="text-xs w-full">
                                            <tbody><tr>
                                                <td class="py-1 text-gray-500">最新净值</td>
                                                <td class="py-1 font-mono">3.2567</td>
                                            </tr>
                                            <tr>
                                                <td class="py-1 text-gray-500">持有份额</td>
                                                <td class="py-1 font-mono">129,857.25</td>
                                            </tr>
                                            <tr>
                                                <td class="py-1 text-gray-500">年化收益</td>
                                                <td class="py-1 font-mono profit">12.15%</td>
                                            </tr>
                                        </tbody></table>
                                    </div>
                                </div>

                                <!-- 持仓产品卡片3 -->
                                <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow group relative">
                                    <div class="flex justify-between">
                                        <div class="font-medium">产品名称：</div>
                                        <div class="loss font-mono text-sm">收益率：-5.0%</div>
                                    </div>
                                    <div class="font-mono text-xl mt-2">市值：￥</div>
                                    
                                    <div class="hidden group-hover:block absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-2 p-4 z-10 border">
                                        <table class="text-xs w-full">
                                            <tbody><tr>
                                                <td class="py-1 text-gray-500">最新净值</td>
                                                <td class="py-1 font-mono">3.2567</td>
                                            </tr>
                                            <tr>
                                                <td class="py-1 text-gray-500">持有份额</td>
                                                <td class="py-1 font-mono">129,857.25</td>
                                            </tr>
                                            <tr>
                                                <td class="py-1 text-gray-500">年化收益</td>
                                                <td class="py-1 font-mono profit">12.15%</td>
                                            </tr>
                                        </tbody></table>
                                    </div>
                                </div>

                                <!-- 持仓产品卡片4 -->
                                <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow group relative">
                                    <div class="flex justify-between">
                                        <div class="font-medium">产品名称：</div>
                                        <div class="loss font-mono text-sm">收益率：-5.0%</div>
                                    </div>
                                    <div class="font-mono text-xl mt-2">市值：￥</div>
                                    
                                    <div class="hidden group-hover:block absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-2 p-4 z-10 border">
                                        <table class="text-xs w-full">
                                            <tbody><tr>
                                                <td class="py-1 text-gray-500">最新净值</td>
                                                <td class="py-1 font-mono">3.2567</td>
                                            </tr>
                                            <tr>
                                                <td class="py-1 text-gray-500">持有份额</td>
                                                <td class="py-1 font-mono">129,857.25</td>
                                            </tr>
                                            <tr>
                                                <td class="py-1 text-gray-500">年化收益</td>
                                                <td class="py-1 font-mono profit">12.15%</td>
                                            </tr>
                                        </tbody></table>
                                    </div>
                                </div>


                            </div>
                        </div>
  </div>

</template>



<script>
export default {
  name: 'Portfolio'
}


</script>



<style scoped>
.medium {
  padding: 20px;
  height: 100%;
  overflow-y: auto; /* 允许滚动 */
}
</style>