var vmDlc3 = function(){
	var self = this;

	self.valves = ko.observableArray([
			ko.observable(new vmValve("Tank Factory")),
			ko.observable(new vmValve("Armory")),
			ko.observable(new vmValve("Department Store")),
			ko.observable(new vmValve("Dragon Command")),
			ko.observable(new vmValve("Infirmary / Barracks")),
			ko.observable(new vmValve("Supply Depot"))
		]);

	self.points = ko.observableArray([ko.observable(new vmPoint("Green Light")), ko.observable(new vmPoint("Code Tube"))]);

	self.getValvePosition = function (name){
		var ret = -1;

		$.each(self.valves(), function(index, value){
			if (value().location() == name)
			{
				ret = value().selectedOption();
				return false;
			}
		});

		return ret;
	}

	self.getPointPosition = function (name){
		var ret = -1;

		$.each(self.points(), function(index, value){
			if (value().name() == name)
			{
				ret = value().selectedOption();
				return false;
			}
		});

		return ret;
	}

	self.solution = ko.pureComputed(function(){

		if (self.solutionReady()){

			var positions = {
				tank: self.getValvePosition('Tank Factory'),
				armory: self.getValvePosition('Armory'),
				departmentStore: self.getValvePosition('Department Store'),
				dragonCommand: self.getValvePosition('Dragon Command'),
				infirmary: self.getValvePosition('Infirmary / Barracks'),
				supplyDepot: self.getValvePosition('Supply Depot'),
				greenLight: self.getPointPosition('Green Light'),
				codeTube: self.getPointPosition('Code Tube')
			}

			var tempSolution = new vmSolution('Solution 1', 3);
			tempSolution.steps.push(new vmSolutionStep("test " + positions.tank, "red"));
			tempSolution.steps.push(new vmSolutionStep("test " + positions.armory, "green"));
			tempSolution.steps.push(new vmSolutionStep("test " + positions.departmentStore, "red"));
			return [tempSolution];
		} else {
			return [];
		}
		
	});

	self.solutionReady = ko.pureComputed(function(){
		var d = self.dummy();

		var valvesSpecified = true;
		var pointsSpecified = true;

		$.each(self.valves(), function(index, value){
			if (!value().selectedOption())
			{
				valvesSpecified = false;
				return false;
			}
		});


		$.each(self.points(), function(index, value){
			if (!value().selectedOption())
			{
				pointsSpecified = false;
				return false;
			}
		});

		return valvesSpecified && pointsSpecified;
	});

	self.dummy = ko.observable();
}

var vmValve = function(location){
	var self = this;

	self.location = ko.observable(location);
	self.options = ko.observableArray(["1", "2", "3"])
	self.selectedOption = ko.observable();

	self.selectedOption.subscribe(function(val){ bo3_dlc3_view.dummy(new Date()); })
}

var vmPoint = function(name){
	var self = this;

	self.name = ko.observable(name);
	self.options = ko.observableArray(["Tank Factory", "Armory", "Department Store", "Dragon Command", "Infirmary / Barracks", "Supply Depot"]);
	self.selectedOption = ko.observable();

	self.selectedOption.subscribe(function(val){ bo3_dlc3_view.dummy(new Date()); })
}

var vmSolution = function(title, changes){
	var self = this;

	self.title = ko.observable(title);
	self.changes = ko.observable(changes);
	self.steps = ko.observableArray([]);
}

var vmSolutionStep = function(locaiton, colour){
	var self = this;

	self.location = ko.observable(locaiton);
	self.colour = ko.observable(colour);
}

var bo3_dlc3_view;
function bo3_dlc3_initialize(){
	bo3_dlc3_view = new vmDlc3();
	ko.applyBindings(bo3_dlc3_view, document.getElementById('valveStep'));
}