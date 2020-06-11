//Component Object
const baseUrl = require('../../config.js')

Component({
	properties: {
		myProperty:{
			type:String,
			value:'',
			observer: function(){}
		},

	},
	data: {
		username: '',
		password: '',
		isShow: true
	},
	methods: {
		inp_username: function(e) {
			// console.log(e.detail.value)
			this.setData({
				username: e.detail.value
			})
			// console.log(this.data.username)
		},
		inp_password: function(e) {
			// console.log(e)
			this.setData({
				password: e.detail.value
			})
		},
		loginBtn: function() {
			var that = this;
			let value1 = this.data.username
			let value2 = this.data.password
			var ret = /^1[3|5|7|8|9][0-9]{9}$/;
			if(ret.test(value1) && value2) {
				wx.request({
					url: `${baseUrl}/login/cellphone?phone=${value1}&password=${value2}`,
					success: function(res) {
						console.log(res.data)
						that.setData({
							isShow: false
						})
						wx.setStorage({
							key: 'userInfo',
							data: res.data
						})
					}
				})
			}
		}
	},
	created: function(){
		let that = this;
		wx.getStorage({
			key: 'userInfo',
			success: res => {
				console.log(res)
				that.setData({
					userInfo: res.data,
					isShow: false
				})
			}
		})
	},
	attached: function(){

	},
	ready: function(){
	},
	moved: function(){
		wx.removeStorage({
			key: 'userInfo',
			success: res => {
				console.log(res)
			}
		})
	},
	detached: function(){
		wx.removeStorage({
			key: 'userInfo',
			success: res => {
				console.log(res)
			}
		})
	},
});