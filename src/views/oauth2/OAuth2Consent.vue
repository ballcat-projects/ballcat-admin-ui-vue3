<template>
  <link
    rel="stylesheet"
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
    integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
    crossorigin="anonymous"
  />
  <div class="container">
    <div class="py-5"><h1 class="text-center">Consent required</h1></div>
    <div class="row">
      <div class="col text-center">
        <p>
          <span class="font-weight-bold text-primary">{{ clientId }}</span>
          wants to access your account
          <span class="font-weight-bold">{{ userInfo?.username }}</span>
        </p>
      </div>
    </div>
    <div class="row pb-3">
      <div class="col text-center">
        <p>
          The following permissions are requested by the above app.<br />Please review these and
          consent if you approve.
        </p>
      </div>
    </div>
    <div class="row">
      <div class="col text-center">
        <form name="consent_form" method="post" action="/api/oauth2/authorize">
          <input type="hidden" name="access_token" :value="accessToken" />
          <input type="hidden" name="client_id" :value="clientId" />
          <input type="hidden" name="state" :value="state" />
          <div v-for="scopeItem in scopeList" :key="scopeItem" class="form-group form-check py-1">
            <input
              :id="scopeItem"
              class="form-check-input"
              type="checkbox"
              name="scope"
              :value="scopeItem"
            />
            <label class="form-check-label" :for="scopeItem">{{ scopeItem }}</label>
          </div>
          <div class="form-group pt-3">
            <button id="submit-consent" class="btn btn-primary btn-lg" type="submit">
              Submit Consent
            </button>
          </div>
          <div class="form-group">
            <button id="cancel-consent" class="btn btn-link regular" type="button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
    <div class="row pt-4">
      <div class="col text-center">
        <p>
          <small
            >Your consent to provide access is required.<br />If you do not approve, click Cancel,
            in which case no information will be shared with the app.</small
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user-store'

// 如果需要被多页签缓存，必须要设置组件名称
defineOptions({ name: 'OAuth2Consent' })

const userStore = useUserStore()
const userInfo = userStore.userInfo
const accessToken = userStore.accessToken

const route = useRoute()
const query = route.query
const clientId = query.client_id
const state = query.state
const scope = query.scope as string
const scopeList = ref(scope ? scope.split(' ') : [])
</script>
