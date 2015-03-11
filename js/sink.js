Sink = function (props, resources, fieldRootElem) {
	
	this.mProperties = {
		title: "",
		type: null,
		holds: [],
		cssClass: "",
		id: "",
		ruleSet: null,
		maxTickCount: 500
	};
	this.mFieldRootObj = fieldRootElem;
	this.mSinkRootObj = null;
	this.mSinkType = props;
	this.mTickCount = 0;
	this.mResources = {
		outgoing: {},
		incoming: {}
	}
	
	if(!props) {
		console.debug('sinks require prop definitions', props);
		return;
	}
	if(!this.mFieldRootObj) {
		console.debug('field object not defined. Sink will not be visible', this.mFieldRootObj);
	}
	gUtils.ParseProps(this, props);
	if(resources) {
		if(resources.hasOwnProperty("outgoing")) {
			for(var i=0, l=resources.outgoing.length; i<l; i++) {
				var currResource = resources.outgoing[i];
				var currType = currResource.type;
				if (!this.mResources.outgoing.hasOwnProperty(currType)) {
					this.mResources.outgoing[currType] = [];
				} 
				this.mResources.outgoing[currType].push(new Resource(currResource)) 
			}
		}
	}
	this.GenerateDOM();
}

Sink.prototype.Update = function () {
	if (this.mFieldRootObj) {
		this.mSinkRootObj.innerHTML = this.mProperties.title + "<br>";
		var resourceArr = [this.mResources.outgoing, this.mResources.incoming]
		for (var x = 0, y = resourceArr.length; x < y; x++) {
			var currResource = resourceArr[x];
			var resourceTypes = Object.keys(currResource);
			
			for (var i = 0, l = resourceTypes.length; i < l; i++) {
				var currType = currResource[resourceTypes[i]][0];
				var totalResources = currResource[resourceTypes[i]].length
				if (totalResources > 0 && currType) {
					this.mSinkRootObj.innerHTML += currType.mProperties.title + ": " + totalResources + "<br>";
				}
			}
		}
		this.mProperties.ruleSet(this, "update");
	}
}

Sink.prototype.GenerateDOM = function () {
	if (this.mFieldRootObj) {
		this.mSinkRootObj = gUtils.CreateDivObj(this.mProperties.id, this.mProperties.cssClass);
		this.mFieldRootObj.appendChild(this.mSinkRootObj);
	}
}

Sink.prototype.GenerateResource = function (resourceType, isOutgoing) {
	var tempResource = new Resource(resourceType);
	var targetList = (isOutgoing) ? this.mResources.outgoing : this.mResources.incoming;
	
	if(!targetList.hasOwnProperty(resourceType.type)) {
		targetList[resourceType.type] = [];
	}
	
	targetList[resourceType.type].push(tempResource);
}

Sink.prototype.AddResourceToAgent = function (newResource, agent, destination) {
	var type = newResource.type
	if(this.mResources.outgoing.hasOwnProperty(type)){
		var newResource = new Resource(newResource);
		newResource.mOrigin = this;
		newResource.mDestination = destination;
		agent.mResources.push(newResource)
		this.mResources.outgoing[type].shift();
	}
}

Sink.prototype.RemoveResourceFromAgent = function (newResource, agent, destination) {
	var type = newResource.type
	if (!this.mResources.incoming.hasOwnProperty(type)) {
		this.mResources.incoming[type] = [];
	}
	var newResource = new Resource(newResource);
	newResource.mOrigin = this;
	newResource.mDestination = destination;
	this.mResources.incoming[type].push(newResource)
	agent.mResources.shift();
	
}

Sink.prototype.GetCoords = function () {
	var tx = this.mSinkRootObj.offsetLeft;
	var ty = this.mSinkRootObj.offsetTop;
	var tw = this.mSinkRootObj.offsetWidth/2;
	var th = this.mSinkRootObj.offsetHeight/2;
	return { x: (tx+tw), y: (ty+th) }
}


