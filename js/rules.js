Rules = {};

//begin agent rules
Rules.mAgentRules = {}
Rules.mAgentRules['deliveryTruck'] = function (currAgent, sinks) {
	switch(currAgent.mAgentState) {
		case Agent.kAgentStates['IDLE']: 
				//if idle, go back to work
				currAgent.SetDestination(currAgent.mProperties.work, sinks);
			break;
		case Agent.kAgentStates['ATDESTINATION']:
				//trigger drop off from sink
				if (currAgent.mDestination.mProperties.ruleSet) {
					currAgent.mDestination.mProperties.ruleSet(currAgent.mDestination, currAgent);
				}
				//deliver resources if needed
				if (currAgent.mDestination.mProperties.type === currAgent.mProperties.work.type) {
					if (currAgent.mResources.length === 3) {
						currAgent.SetDestination(currAgent.mResources[0].mDestination, sinks);
					}
				} else {
					if (currAgent.mResources.length > 0) {
						currAgent.SetDestination(currAgent.mResources[0].mDestination, sinks);
					} else {
						currAgent.SetDestination(currAgent.mProperties.work, sinks);
					}
				}
			break;
		case Agent.kAgentStates['INTRANSIT']: 
				currAgent.FindDestination();
			break;
			
			
		
	}
}

Rules.mAgentRules['human'] = function (currAgent, sinks) {
	switch(currAgent.mAgentState) {
		case Agent.kAgentStates['IDLE']: 
				currAgent.SetDestination(currAgent.mProperties.home, sinks);
			break;
		case Agent.kAgentStates['ATDESTINATION']:
				if (currAgent.mDestination.mProperties.ruleSet) {
					currAgent.mDestination.mProperties.ruleSet(currAgent.mDestination, currAgent);
				}
				if(currAgent.mDestination.mProperties.type == currAgent.mProperties.work.type) {
					currAgent.SetDestination(currAgent.mProperties.home, sinks);
				} else {
					currAgent.SetDestination(currAgent.mProperties.work, sinks);
				}
			break;
		case Agent.kAgentStates['INTRANSIT']: 
				currAgent.FindDestination();
			break;
	}
}


//begin sink rules
Rules.mSinkRules = {}
Rules.mSinkRules['depot'] = function (currSink, agent) {
	if (agent === "update") {
		currSink.mTickCount++;
		if(currSink.mTickCount > currSink.mProperties.maxTickCount) {
			currSink.GenerateResource(resources.postalPackage, true);
			currSink.mTickCount = 0;
		}
	} else {
		switch (agent.mAgentType.type) {
			case agents.postalTruck.type:
				if (currSink.mResources.outgoing[resources.postalPackage.type].length >= 3) {
					var destArr = [sinks.house, sinks.officeBuilding, sinks.factory];
					//randomize the order of destinations a bit so the delivery agent doesnt always take the same path
					switch(Math.floor(((Math.random()*8)+1)/2)) {
						case 0: 
							destArr = [sinks.house, sinks.factory, sinks.officeBuilding];
							break;
						case 1: 
							destArr = [sinks.factory, sinks.house, sinks.officeBuilding];
							break;
						case 2: 
							destArr = [sinks.officeBuilding, sinks.house, sinks.factory];
							break;
						case 3: 
							destArr = [sinks.factory, sinks.officeBuilding, sinks.house];
							break;
						case 4: 
							destArr = [sinks.house, sinks.officeBuilding, sinks.factory];
							break;
					}
					currSink.AddResourceToAgent(resources.postalPackage, agent, destArr[0]);
					currSink.AddResourceToAgent(resources.postalPackage, agent, destArr[1]);
					currSink.AddResourceToAgent(resources.postalPackage, agent, destArr[2]);
				}
				break;
			case agents.human.type:
				
				break;
		}
	}
}

Rules.mSinkRules['office'] = function (currSink, agent) {
	if (agent === "update") {
		currSink.mTickCount++;
		if(currSink.mTickCount > currSink.mProperties.maxTickCount) {
			currSink.mTickCount = 0;
		}
	} else {
		switch (agent.mAgentType.type) {
			case agents.postalTruck.type:
				currSink.RemoveResourceFromAgent(resources.postalPackage, agent, sinks.officeBuilding);
				break;
			case agents.human.type:
				
				break;
		}
	}
}

Rules.mSinkRules['house'] = function (currSink, agent) {
	if (agent === "update") {
		currSink.mTickCount++;
		if (currSink.mTickCount > currSink.mProperties.maxTickCount) {
			currSink.mTickCount = 0;
		}
	} else {
	
		switch (agent.mAgentType.type) {
			case agents.postalTruck.type:
				currSink.RemoveResourceFromAgent(resources.postalPackage, agent, sinks.house);
				break;
			case agents.human.type:
				
				break;
		}
	}
}

Rules.mSinkRules['factory'] = function (currSink, agent) {
	if (agent === "update") {
		currSink.mTickCount++;
		if (currSink.mTickCount > currSink.mProperties.maxTickCount) {
			currSink.mTickCount = 0;
		}
	} else {
	
		switch (agent.mAgentType.type) {
			case agents.postalTruck.type:
				currSink.RemoveResourceFromAgent(resources.postalPackage, agent, sinks.factory);
				break;
			case agents.human.type:
				
				break;
		}
	}
}
