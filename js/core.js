var cCore = function () {
	
	this.mRootElement = {
		obj:  null,
		name: "mainContainer"
	}
	this.mDebugPanel = {
		obj: null,
		name: "debugPanel"
	};
	
	this.mAgents = [];
	this.mSinks = [];
	this.mResources = [];
	this.mTickTimeout = 10; // in milliseconds
	this.mTickCount = 0;
	this.mShowDebug = false;
	this.mCurrentStage = null;
	
}

cCore.prototype.Init = function () {
	this.mRootElement.obj = document.getElementById(this.mRootElement.name);
	this.mCurrentStage = stages[0];
	//show debug?
	if (this.mShowDebug) {
		this.mDebugPanel.obj = document.createElement("div");
		this.mDebugPanel.obj.className = this.mDebugPanel.name;
		this.mRootElement.obj.appendChild(this.mDebugPanel.obj);
	}
	
	//generate field
	this.SpawnSinks();
	this.SpawnAgents();
	
	this.Update();
}

cCore.prototype.SpawnSinks = function() {
	var sinkKeys = Object.keys(this.mCurrentStage.sinks);
	this.mSinks = [];
	for(var i=0, l=sinkKeys.length; i<l; i++) {
		this.mSinks.push(new Sink(this.mCurrentStage.sinks[sinkKeys[i]].type, this.mCurrentStage.sinks[sinkKeys[i]].resources, this.mRootElement.obj));
	}
}

cCore.prototype.SpawnAgents = function() {
	var agentKeys = Object.keys(this.mCurrentStage.agents);
	this.mAgents = [];
	for(var i=0, l=agentKeys.length; i<l; i++) {
		this.mAgents.push(new Agent(this.mCurrentStage.agents[agentKeys[i]].type, this.mCurrentStage.agents[agentKeys[i]].resources, this.mRootElement.obj));
	}
}

cCore.prototype.Update = function(){
	this.mTickCount = this.mTickCount + 1;
	//console.debug('tick', this, this.mTickCount)
	
	for(var i=0, l=this.mSinks.length; i<l; i++) {
		this.mSinks[i].Update();
	}
	for(var i=0, l=this.mAgents.length; i<l; i++) {
		this.mAgents[i].Update(this.mSinks);
	}
	
	//show debug?
	if (this.mShowDebug) {
		this.ShowDebug();
	}
	//reset timeout
	var handler = this;
	setTimeout(function () {
		handler.Update();	
	}, this.mTickTimeout);
}


cCore.prototype.ShowDebug = function () {
	this.mDebugPanel.obj.innerHTML = "Tick #" + this.mTickCount;
}

//global accesor
gCore = new cCore();
