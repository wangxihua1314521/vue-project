<template>
	<div id="login-content">
		<div class="headContent">
			<img src="../assets/images/background.png"/>
			<div class="cover"></div>
			<div class="title">华夏根脉网业务中心</div>
		</div>
		<div class="main text-center">
			<div class="form">
				<h3>欢迎登录</h3>
				<form id="loginForm"  class="form-horizontal">
					<div class="control-group">
						<div class="controls">
							<input type="text" class="form-control" placeholder="账号" v-model="loginParam.account">
						</div>
					</div>
					<div class="control-group">
						<div class="controls">
							<input type="password" class="form-control" placeholder="密码" v-model="loginParam.password">
						</div>
					</div>
					<div class="m-top-md p-top-sm">
						<a href="#" class="btn btn-info block" @click="login">登录</a>
					</div>
					<div class="m-top-md p-top-sm" v-if="errorMsg">
						<div class="font-12 text-center m-bottom-xs errorMsg" v-cloak>
							{{errorMsg}}
						</div>
					</div>
				</form>
			</div>
			<ul>
				<li><img src="../assets/images/feedback.png"/><span class="text-center">用户反馈</span></li>
				<li><img src="../assets/images/message.png"/><span class="text-center">系统通知</span></li>
				<li><img src="../assets/images/problem.png"/><span class="text-center">常见问题</span></li>
			</ul>
			<img src="../assets/images/smalls.png"/>
		</div>
	</div>
</template>

<script>
import {sendAjax, systemIdKey} from '../assets/js/http.js'
import keyListener from '@/assets/js/keyListener.js'
export default {
  data () {
    return {
      loginParam: {
        platform: '0',
        systemIdKey,
        account: 'abc',
        password: '123456'
      },
      errorMsg: ''
    }
  },
  mounted () {
    // 监听回车
    keyListener.$on('keypress', (e) => {
      const path = this.$router.currentRoute.path
      if ((path === '/login' || path === '/') &&
        e.keyCode === 13) this.login()
    })
  },
  methods: {
  	//登录
    login () {
      sendAjax('', '/login', 'post', this.loginParam, res => {
            // 登录成功
        console.log('登录成功')
        const result = res.data.data
        this.$store.commit('loginSuccess', {
          auth: result.authorization,
          userInfo: result.user
        })
        this.$router.push('/index')
      },
      error => {
        // 登录失败
        console.log(error)
        this.errorMsg = error.data.msg || ''
      })
    }
  }
}
</script>

<style type="text/css">
	body{
		font-family: "microsoft yahei";
		font-size: 18px;
		background-color: #FFFFFF;
		color: #333333;
	}
	.headContent{
		width: 100%;
		height: 300px;
		position: relative;
		overflow: hidden;
		color: #FFFFFF;
		font-size: 60px;
	}
	.headContent img{
		width: 100%;
		height: 100%;
	}
	.headContent .cover{
		position: absolute;
		width: 100%;
		height: 300px;
		top: 0;
		left: 0;
		z-index: 2;
		background: rgba(77,153,203,0.9);
	}
	.headContent .title{
		text-align: center;
	    height: 80px;
	    position: absolute;
	    top: 0;
	    bottom: 0;
	    left: 0;
	    right: 0;
	    margin: auto;
	    z-index: 100;
	}
	.main{
		width: 1200px;
		height: auto;
		overflow: hidden;
		margin: 0 auto;
		text-align: center;
	}
	.main ul{
		margin: 400px auto 70px;
		width: 650px;
		overflow: hidden;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.main ul li{
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.main ul li span{
		display: block;
		margin-top: 10px;
	}
	.errorMsg{
		color: #E0242A;
	}
	.main .form{
		position: absolute;
		top: 250px;
		left: 0;
		right: 0;
		margin: auto;
		width:350px;
		height: 350px;
		z-index: 1000;
		border-radius: 10px;
		box-shadow: 0 3px 15px rgba(0,0,0,0.1);
		outline: 0;
		background-clip: padding-box;
		text-align: center;
		padding: 20px;
		padding-top: 0;
		background: #fff;
	}
	.main .form h3{
		font-size: 24px;
		margin-top: 20px;
   	    margin-bottom: 10px;
   	    font-family: inherit;
	    font-weight: 500;
	    line-height: 1.1;
	    color: inherit;
	}
	.main .form .form-control{
		height: 50px;
		margin: 20px 0;
		border-radius: 10px;
		box-shadow: 0 3px 15px rgba(0,0,0,0.1);
		outline: 0;
		border: 0;
		font-size: 16px;
		display: block;
		width: 100%;
		padding: 6px 12px;
	}
	.main .form .btn{
		display: block;
		margin-bottom: 0;
	    font-size: 14px;
	    font-weight: 400;
	    line-height: 1.42857143;
	    text-align: center;
	    white-space: nowrap;
	    vertical-align: middle;
	    cursor: pointer;
	    border-radius: 4px;
		padding: 12px 12px;
		color: #fff;
	}
	.main .form .m-top-md{
		margin-top: 20px;
		padding-top: 10px;
	}
	.form .btn.btn-info {
	    background: #57aafe;
	    border: 1px solid #57aafe;
	}
	[v-cloak] {display: none;}
	.main img{
		max-width: 100%;
	}
	input {
	    background-color: rgb(250, 255, 189);
	}
</style>
