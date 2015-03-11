Agent = function (props, resources, fieldRootElem) {
	if(!props) {
		alert('agents require prop definitions')
		return;
	}
	
	this.mProperties = {
		title: "",
		type: null,
		canCarry: [],
		needs: [],
		home: null,
		work: null,
		cssClass: null,		
		ruleSet: null,
		stepAmount: 2.7
	}
	this.mFieldRootObj = fieldRootElem;
	this.mAgentRootObj = null;
	this.mAgentType = props;
	this.mAgentState = Agent.kAgentStates['IDLE'];
	this.mDestination = null;
	this.mResources = [];
	
	gUtils.ParseProps(this, props);
	this.GenerateDOM();
}
Agent.kAgentStates = {
	"IDLE": 0,
	"HOME": 1,
	"WORK": 2,
	"ATDESTINATION": 3,
	"INTRANSIT": 4
};

Agent.prototype.Update = function (sinks) {
	if(this.mProperties.ruleSet) {
		this.mProperties.ruleSet(this, sinks);
	}
}

Agent.prototype.GenerateDOM = function () {
	if (this.mFieldRootObj) {
		this.mAgentRootObj = gUtils.CreateDivObj(this.mProperties.id, this.mProperties.cssClass);
		this.mFieldRootObj.appendChild(this.mAgentRootObj);
	}
}

Agent.prototype.FindDestination = function (sinks) {
	var targetCoords = this.mDestination.GetCoords();
	var currCoords = this.GetCoords();
	var newX = 0;
	var newY = 0;
	if(currCoords.x > targetCoords.x) {
		newX = this.mAgentRootObj.offsetLeft - this.mProperties.stepAmount;
		newX = (newX < targetCoords.x) ? targetCoords.x : newX;
	} else {
		newX = this.mAgentRootObj.offsetLeft + this.mProperties.stepAmount;
		newX = (newX > targetCoords.x) ? targetCoords.x : newX;
	}

	if(currCoords.y > targetCoords.y) {
		newY = this.mAgentRootObj.offsetTop - this.mProperties.stepAmount;
		newY = (newY < targetCoords.y) ? targetCoords.y : newY; 
	} else {
		newY = this.mAgentRootObj.offsetTop + this.mProperties.stepAmount;
		newY = (newY > targetCoords.y) ? targetCoords.y : newY;
	}
	
	var yDiff = newY - targetCoords.y;
	yDiff = (yDiff < 0) ? yDiff * -1 : yDiff;
	if(yDiff < this.mProperties.stepAmount) {
		newY = targetCoords.y
	}
	var xDiff = newX - targetCoords.x;
	xDiff = (xDiff < 0) ? xDiff * -1 : xDiff;
	if(xDiff < this.mProperties.stepAmount) {
		newX = targetCoords.x;
	}
	
	this.mAgentRootObj.style.left = newX + "px";
	this.mAgentRootObj.style.top = newY + "px";
	if(newX === targetCoords.x && newY === targetCoords.y) {
		this.mAgentState = Agent.kAgentStates['ATDESTINATION'];
	}
	
}

Agent.prototype.SetDestination = function (targetSink, sinks) {
	for(var i=0, l=sinks.length; i<l; i++) {
		if(sinks[i].mProperties.type == targetSink.type) {
			this.mDestination = sinks[i];
			this.mAgentState = Agent.kAgentStates['INTRANSIT'];
			return;		
		}
	}
}

Agent.prototype.GetCoords = function () {
	var tx = this.mAgentRootObj.offsetLeft;
	var ty = this.mAgentRootObj.offsetTop;
	var tw = this.mAgentRootObj.offsetWidth/2;
	var th = this.mAgentRootObj.offsetHeight/2;
	return { x: (tx+tw), y: (ty+th) }
}
