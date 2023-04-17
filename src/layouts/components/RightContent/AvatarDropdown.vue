<template>
  <span v-if="loading" :class="[$style.action, $style.account]">
    <a-spin size="small" style="margin-left: 8px; margin-right: 8px" />
  </span>
  <header-dropdown v-else overlay-class-name="avatar-dropdown">
    <span :class="[$style.action, $style.account]">
      <a-avatar size="small" :class="$style.avatar" :src="currentUser.avatar" alt="avatar" />
      <span :class="[$style.name, 'anticon']">{{ currentUser.nickname }}</span>
    </span>

    <template #overlay>
      <a-menu :class="$style.menu" @click="onMenuClick">
        <template v-if="props.menu">
          <a-menu-item key="center">
            <UserOutlined />
            个人中心
          </a-menu-item>
          <a-menu-item key="settings">
            <SettingOutlined />
            个人设置
          </a-menu-item>
          <a-menu-divider style="margin: 4px 0" />
        </template>

        <a-menu-item key="logout">
          <LogoutOutlined />
          退出登录
        </a-menu-item>
      </a-menu>
    </template>
  </header-dropdown>
</template>

<script setup lang="ts">
import HeaderDropdown from '@/layouts/components/HeaderDropdown'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface'
import { Modal } from 'ant-design-vue'
import { logout } from '@/api/auth'
import { useUserStore } from '@/stores/user-store'
import { loginPath } from '@/config'
import { fileAbsoluteUrl } from '@/utils/file-utils'

// 目前不支持接口导入: https://github.com/vuejs/core/issues/4294
type GlobalHeaderRightProps = {
  menu?: boolean
}

const props = withDefaults(defineProps<GlobalHeaderRightProps>(), {
  menu: true
})
const loading = ref(false)

const userStore = useUserStore()

const currentUser = computed(() => {
  const userInfo = userStore.userInfo
  return {
    nickname: userInfo?.nickname,
    avatar: userInfo?.avatar ? fileAbsoluteUrl(userInfo?.avatar) : ''
  }
})

const router = useRouter()

const loginOut = () => {
  Modal.confirm({
    title: '提示',
    content: '确定要退出登录吗 ?',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      // 没有 accessToken 的话，直接登出
      if (!userStore.accessToken) {
        setTimeout(() => {
          router.push(loginPath)
        }, 200)
        return
      }
      // 有 accessToken 的话，就先执行登出操作
      logout().then(() => {
        userStore.clean()
        setTimeout(() => {
          router.push(loginPath)
        }, 200)
      })
    }
  })
}

const onMenuClick = (event: MenuInfo) => {
  const { key } = event
  if (key === 'logout') {
    loginOut()
  }
}
</script>

<script lang="ts">
export default {
  name: 'AvatarDropdown'
}
</script>

<style lang="less" module>
@import './index.less';
</style>
