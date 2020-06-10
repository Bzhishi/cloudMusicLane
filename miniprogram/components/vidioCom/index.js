//Component Object
Component({
	properties: {
		myProperty:{
			type:String,
			value:'',
			observer: function(){}
		},

	},
	data: {
		icon: 'iconfont icon-sousuo'
	},
	methods: {
		openSearch() {
			wx.navigateTo({
				url: ''
			})
		}
	},
	created: function(){

	},
	attached: function(){

	},
	ready: function(){

	},
	moved: function(){

	},
	detached: function(){

	},
});