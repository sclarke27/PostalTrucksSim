cUtils = function () {
	
}

cUtils.prototype.ParseProps = function (targetObj, props) {
	if(!targetObj.mProperties) {
		console.debug("target does not have mProperties", targetObj);
	}
	var propKeys = Object.keys(props);
	for(var i=0, l=propKeys.length; i<l; i++) {
		if(targetObj.mProperties.hasOwnProperty(propKeys[i])) {
			targetObj.mProperties[propKeys[i]] = props[propKeys[i]];
		} 
	}
}

cUtils.prototype.CreateDivObj = function (divId, cssClass) {
	var newObj = document.createElement("div");
	newObj.id = divId;
	newObj.className = cssClass;
	return newObj;
}

gUtils = new cUtils();

/**
 * for IE8 compatibility but brute forcing on all browsers to skip browser detection
 * pulled from http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation after a quick google search
 * 
 */
Object.keys = Object.keys || (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
        DontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ],
        DontEnumsLength = DontEnums.length;
  
    return function (o) {
        if (typeof o != "object" && typeof o != "function" || o === null)
            throw new TypeError("Object.keys called on a non-object");
     
        var result = [];
        for (var name in o) {
            if (hasOwnProperty.call(o, name))
                result.push(name);
        }
     
        if (hasDontEnumBug) {
            for (var i = 0; i < DontEnumsLength; i++) {
                if (hasOwnProperty.call(o, DontEnums[i]))
                    result.push(DontEnums[i]);
            }   
        }
     
        return result;
    };
})();
