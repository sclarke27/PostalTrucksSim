Resource = function (props) {
	
	//these are the things which make the resource unique
	this.mProperties = {
		title: "",
		cssClass: "",
		recycleTimeout: 2000
	};
	
	this.mOrigin = null;
	this.mDestination = null;
	
	if(!props) {
		alert('a resource requires a prop definition')
		return;
	}
	
	gUtils.ParseProps(this, props);
}

Resource.prototype.Update = function () {
	
}
