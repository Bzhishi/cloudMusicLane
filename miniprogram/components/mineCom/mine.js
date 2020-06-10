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
	},
	methods: {
		swiperChange(e) {
			this.setData({
				currentTab: e.datail.current
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