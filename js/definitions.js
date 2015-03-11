//define field resources
var resources = {};
resources.postalPackage = {
	title: "Mail Parcel",
	cssClass: "parcel",
	type: "mailParcel"
}

resources.foodItem = {
	title: "Food item",
	cssClass: "foodItem",
	type: "foodItem"
}

//defined field sinks
var sinks = {};
sinks.officeBuilding = {
	title: "Office Building",
	type: "office",
	holds: [resources.postalPackage],
	cssClass: "delivery-address",
	id: "office",
	priority: 0,
	ruleSet: Rules.mSinkRules['office']
}

sinks.factory = {
	title: "Factory",
	type: "factory",
	holds: [resources.postalPackage, resources.foodItem],
	cssClass: "delivery-address",
	id: "factory",
	priority: 2,
	ruleSet: Rules.mSinkRules['factory']
}

sinks.house = {
	title: "House",
	type: "house",
	holds: [resources.postalPackage, resources.foodItem],
	needs: [resources.postalPackage, resources.foodItem],
	cssClass: "delivery-address",
	id: "house",
	priority: 1,
	ruleSet: Rules.mSinkRules['house']
}

sinks.postOffice = {
	title: "Post Office",
	type: "depot",
	holds: [resources.postalPackage],
	needs: [resources.postalPackage],
	cssClass: "depot",
	id: "postOffice",
	priority: 0,
	ruleSet: Rules.mSinkRules['depot'],
	maxTickCount: 270
}

//define field agents
var agents = {};
agents.postalTruck = {
	title: "truck",
	type: "deliveryTruck",
	canCarry: [resources.postalPackage],
	needs: [resources.postalPackage],
	work: sinks.postOffice,
	cssClass: "delivery-truck",
	ruleSet: Rules.mAgentRules['deliveryTruck']
}

agents.human = {
	title: "Random Human",
	type: "human",
	canCarry: [resources.postalPackage, resources.foodItem],
	needs: [resources.foodItem],
	home: sinks.house,
	work: sinks.officeBuilding,
	cssClass: "human",
	ruleSet: Rules.mAgentRules['human']
}

//define field stages
var stages = {};
stages = [
	{
		agents: [
					{
						type: agents.postalTruck,
						resources: null
					}/*,
					{
						type: agents.human,
						resources: null
					}*/
				],
		sinks: [
					{
						type: sinks.postOffice,
						resources: {
							outgoing: [resources.postalPackage, resources.postalPackage, resources.postalPackage]
						}
					},
					{
						type: sinks.house,
						resources: null /*{
							outgoing: [resources.foodItem]
						}*/
					},
					{
						type: sinks.factory,
						resources: null
					},
					{
						type: sinks.officeBuilding,
						resources: null
					}
					
				]  
	}
]
