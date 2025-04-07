<template>
  <div class="home-container">
    <el-container>
      <el-header>
        <div class="header-content">
          <div class="left">
            <h2>股票信息查看系统</h2>
            <el-input
              v-model="searchQuery"
              placeholder="搜索股票代码/名称"
              class="search-input"
              :prefix-icon="Search"
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button :icon="Search" @click="handleSearch">搜索</el-button>
              </template>
            </el-input>
          </div>
          <div class="right">
            <span class="welcome-text">欢迎回来，{{ username }}</span>
            <el-button type="danger" @click="handleLogout">退出登录</el-button>
          </div>
        </div>
      </el-header>
      
      <el-main>
        <!-- 市场指数展示 -->
        <el-row :gutter="20" class="market-indices">
          <el-col :span="8">
            <el-card shadow="hover">
              <template #header>
                <div class="index-header">
                  <span>上证指数</span>
                  <span class="price up">3,386.23</span>
                </div>
              </template>
              <div class="index-content">
                <span class="change up">+21.32</span>
                <span class="change-percent up">+0.63%</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              <template #header>
                <div class="index-header">
                  <span>深证成指</span>
                  <span class="price down">11,236.32</span>
                </div>
              </template>
              <div class="index-content">
                <span class="change down">-52.65</span>
                <span class="change-percent down">-0.47%</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              <template #header>
                <div class="index-header">
                  <span>创业板指</span>
                  <span class="price up">2,286.45</span>
                </div>
              </template>
              <div class="index-content">
                <span class="change up">+15.78</span>
                <span class="change-percent up">+0.69%</span>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 自选股票列表 -->
        <el-card class="stock-list-card">
          <template #header>
            <div class="card-header">
              <span>自选股票</span>
              <el-button type="primary" @click="handleAddStock">添加自选</el-button>
            </div>
          </template>
          <el-table :data="watchlist" style="width: 100%">
            <el-table-column prop="code" label="股票代码" width="120" />
            <el-table-column prop="name" label="股票名称" width="120" />
            <el-table-column prop="price" label="最新价" width="100">
              <template #default="{ row }">
                <span :class="{ 'up': row.change > 0, 'down': row.change < 0 }">
                  {{ row.price }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="change" label="涨跌额" width="100">
              <template #default="{ row }">
                <span :class="{ 'up': row.change > 0, 'down': row.change < 0 }">
                  {{ row.change }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="changePercent" label="涨跌幅" width="100">
              <template #default="{ row }">
                <span :class="{ 'up': row.change > 0, 'down': row.change < 0 }">
                  {{ row.changePercent }}%
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="volume" label="成交量" />
            <el-table-column prop="amount" label="成交额" />
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button type="danger" size="small" @click="handleRemoveStock(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 热门股票 -->
        <el-card class="hot-stocks-card">
          <template #header>
            <div class="card-header">
              <span>热门股票</span>
              <el-radio-group v-model="hotStockType" size="small">
                <el-radio-button label="turnover">换手率</el-radio-button>
                <el-radio-button label="increase">涨幅榜</el-radio-button>
                <el-radio-button label="decrease">跌幅榜</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <el-table :data="hotStocks" style="width: 100%">
            <el-table-column prop="code" label="股票代码" width="120" />
            <el-table-column prop="name" label="股票名称" width="120" />
            <el-table-column prop="price" label="最新价" width="100">
              <template #default="{ row }">
                <span :class="{ 'up': row.change > 0, 'down': row.change < 0 }">
                  {{ row.price }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="changePercent" label="涨跌幅" width="100">
              <template #default="{ row }">
                <span :class="{ 'up': row.change > 0, 'down': row.change < 0 }">
                  {{ row.changePercent }}%
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="turnoverRate" label="换手率" />
          </el-table>
        </el-card>
      </el-main>

      <el-footer height="auto" class="footer">
        <div class="disclaimer">
          📜 免责声明：本网站数据仅供参考，不构成投资建议。股市有风险，入市需谨慎。
        </div>
        <div class="links">
          <a href="#" @click.prevent="showPrivacyPolicy">🔒 隐私政策</a> | 
          <a href="#" @click.prevent="showUserAgreement">用户协议</a>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const username = localStorage.getItem('username') || '用户'

// 搜索相关
const searchQuery = ref('')
const handleSearch = () => {
  if (!searchQuery.value) {
    ElMessage.warning('请输入搜索内容')
    return
  }
  // TODO: 实现搜索功能
  console.log('搜索:', searchQuery.value)
}

// 自选股票相关
const watchlist = ref([
  {
    code: '600000',
    name: '浦发银行',
    price: '8.23',
    change: '0.13',
    changePercent: '1.61',
    volume: '2345.67万',
    amount: '1.93亿'
  },
  // 添加更多示例数据
])

const handleAddStock = () => {
  // TODO: 实现添加自选股票功能
  ElMessage.info('添加自选股票功能开发中')
}

const handleRemoveStock = (stock) => {
  // TODO: 实现删除自选股票功能
  ElMessage.success(`已删除 ${stock.name}`)
}

// 热门股票相关
const hotStockType = ref('turnover')
const hotStocks = ref([
  {
    code: '000001',
    name: '平安银行',
    price: '15.23',
    change: '0.52',
    changePercent: '3.42',
    turnoverRate: '2.5%'
  },
  // 添加更多示例数据
])

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('退出登录成功')
  router.push('/login')
}

// 隐私政策弹窗
const showPrivacyPolicy = () => {
  ElMessageBox.alert(
    '隐私政策内容...',
    '隐私政策',
    {
      confirmButtonText: '我知道了',
      customClass: 'policy-dialog'
    }
  )
}

// 用户协议弹窗
const showUserAgreement = () => {
  ElMessageBox.alert(
    '用户协议内容...',
    '用户协议',
    {
      confirmButtonText: '我知道了',
      customClass: 'policy-dialog'
    }
  )
}
</script>

<style scoped>
.home-container {
  height: 100vh;
  background-color: #f5f5f5;
}

.el-header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  padding: 0 20px;
}

.header-content {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content .left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-content .right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-input {
  width: 300px;
}

.welcome-text {
  font-size: 14px;
  color: #606266;
}

.el-main {
  padding: 20px;
}

.market-indices {
  margin-bottom: 20px;
}

.index-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.index-content {
  display: flex;
  gap: 10px;
}

.stock-list-card,
.hot-stocks-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.up {
  color: #f56c6c;
}

.down {
  color: #67c23a;
}

.price {
  font-size: 20px;
  font-weight: bold;
}

.change,
.change-percent {
  font-size: 14px;
}

.footer {
  background-color: #fff;
  padding: 20px;
  text-align: center;
  border-top: 1px solid #e4e7ed;
}

.disclaimer {
  color: #606266;
  margin-bottom: 10px;
  font-size: 14px;
}

.links {
  font-size: 14px;
}

.links a {
  color: #409eff;
  text-decoration: none;
  transition: color 0.3s;
}

.links a:hover {
  color: #66b1ff;
}

:deep(.policy-dialog) {
  max-width: 600px;
}
</style> 