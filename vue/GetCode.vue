<template>
  <!-- TODO: 需要根据需求修改 -->
  <button
    class="get_num_btn"
    v-bind:class="{disabled: wait_timer>0}"
    @click="getMobileCode()"
  >{{ CodeText }}</button>
</template>

<script>
export default {
  name: 'getCode',
  props: {
    mobile: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      wait_timer: -1
    };
  },
  computed: {
    CodeText() {
      const wait_timer = this.wait_timer;
      let msg = '';
      if (wait_timer > 0) {
        msg = wait_timer + 's后获取';
      } else if (wait_timer === 0) {
        msg = '重新获取';
      } else if (wait_timer === -1) {
        msg = '获取验证码';
      } else if (wait_timer === -2) {
        msg = '获取中';
      }
      return msg;
    }
  },
  methods: {
    msg(msg, type = 'info') {
      this.$emit('msg', {
        type,
        msg
      });
    },
    v_mobile() {
      if (this.wait_timer > 0) {
        return false;
      }
      if (!this.mobile) {
        throw new Error('手机号不能为空');
      }
      if (!/^1[3|4|5|7|8|9]\d{9}$/.test(this.mobile)) {
        throw new Error('手机号格式不正确');
      }
      return true;
    },
    countdown() {
      this.wait_timer = 59;
      var that = this;
      var timer_interval = setInterval(function() {
        if (that.wait_timer > 0) {
          that.wait_timer--;
        } else {
          clearInterval(timer_interval);
        }
      }, 1000);
    },
    async getMobileCode() {
      try {
        this.v_mobile();
      } catch (error) {
        console.log(error.message);
        return this.msg(error.message, 'error');
      }

      this.wait_timer = -2;
      //在这里调取你获取验证码的ajax
      // 同时处理一下接口返回出错问题
      // TODO: 具体看具体修改
      this.msg('获取验证码成功');

      this.countdown();
    }
  }
};
</script>

<style>
/* TODO: 需要根据需求修改 */
input {
  font-size: 16px;
  padding: 4px;
  -webkit-tap-highlight-color: transparent;
  outline-style: none;
  list-style: none;
}
.get_num_btn {
  width: 78px;
  height: 30px;
  font-size: 13px;
  color: white;
  display: block;
  background: #3bc987;
  border-radius: 4px;
  text-align: center;
  line-height: 30px;
  margin-top: 8px;
  border: none;
  outline: none;
}
.get_num_btn.disabled {
  background: #c8c8c8;
}
</style>
