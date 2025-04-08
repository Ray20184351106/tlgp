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

        <!-- 公司列表 -->
        <el-card class="stock-list-card">
          <template #header>
            <div class="card-header">
              <span>公司列表</span>
              <el-button type="primary" @click="handleAddFirm">添加公司</el-button>
            </div>
          </template>
          <el-table :data="firmList" style="width: 100%" v-loading="loading">
            <el-table-column prop="firmid" label="公司ID" width="120" />
            <el-table-column prop="firmname" label="公司名称" />
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button size="small" @click="handleEditFirm(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDeleteFirm(scope.row)">删除</el-button>
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

      <!-- 添加/编辑对话框 -->
      <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
        <el-form :model="firmForm" ref="firmFormRef" label-width="80px">
          <el-form-item label="公司名称" prop="firmname">
            <el-input v-model="firmForm.firmname"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
          </span>
        </template>
      </el-dialog>

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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getFirmList, addFirm, updateFirm, deleteFirm } from '@/api/firm'

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
  // 暂时只显示提示信息
  ElMessage.info('搜索功能开发中')
}

// firm表格相关
const firmList = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('添加公司')
const firmForm = ref({
  firmid: null,
  firmname: ''
})

const fetchFirmList = async () => {
  loading.value = true
  try {
    const response = await getFirmList()
    console.log('API响应数据:', response)
    if (response.length > 0) {
      firmList.value = response
    } else {
      ElMessage.error(response.message || '获取数据失败')
    }
  } catch (error) {
    console.error('获取公司列表错误:', error)
    ElMessage.error('获取公司列表失败: ' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

const handleAddFirm = () => {
  dialogTitle.value = '添加公司'
  firmForm.value = {
    firmid: null,
    firmname: ''
  }
  dialogVisible.value = true
}

const handleEditFirm = (row) => {
  dialogTitle.value = '编辑公司'
  firmForm.value = {
    firmid: row.firmid,
    firmname: row.firmname
  }
  dialogVisible.value = true
}

const handleDeleteFirm = (row) => {
  ElMessageBox.confirm(
    '确认删除该公司吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    deleteFirm(row.firmid)
      .then(response => {
        ElMessage.success('删除成功')
        fetchFirmList()
      })
      .catch(error => {
        ElMessage.error('删除失败')
      })
  }).catch(() => {})
}

const submitForm = () => {
  if (firmForm.value.firmid) {
    // 更新
    updateFirm(firmForm.value.firmid, {
      firmname: firmForm.value.firmname
    })
      .then(response => {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        fetchFirmList()
      })
      .catch(error => {
        ElMessage.error('更新失败：' + (error.message || '未知错误'))
      })
  } else {
    // 添加
    addFirm(firmForm.value)
      .then(response => {
        ElMessage.success('添加成功')
        dialogVisible.value = false
        fetchFirmList()
      })
      .catch(error => {
        ElMessage.error('添加失败：' + (error.message || '未知错误'))
      })
  }
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

// 在组件挂载时获取公司列表
onMounted(() => {
  fetchFirmList()
})
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