var DateModel = Backbone.Model.extend({
	defaults:{
		date: null
	},
	initialize: function(cur_date){
		this.date = cur_date || new Date();
		
	},
	GetDateString: function(){
		return "year: " + this.date.getMonth() + "month: " + this.date.getFullYear();
	},
	GetDays: function(){
		// функция генерирующая 
		//список дней по именам недели
		// либо придумать что-то другое
		return [{day:"Вторник", num:1}];
	}
});
var CalendarView = Backbone.View.extend({
	render: function(){
		var val = this.model.GetDateString();
		var div = $('<div>').text(val);
		console.log(val);
		$('body').append(div);
	},
	initialize: function(){
		console.log($('body'));
		//Календаь на шаблоне 
		//с циклом по дням.
		/*
		<% _.each(days, function(day, num) { %> 
    <a class="btn"><%= acs.label %></a>
<% });
		*/
		this.render();
	}
});

var EventModel = Backbone.View.extend({
	default:{
		date: null,
		title: '',
		desc: ''
	}		
});

var EventList = Backbone.View.extend({
	render: function(){
		this.select = $('<select>');	
	},
	initialize: function(){
		//Список событий с шаблоном
		this.render();
	}
});
var events = new Backbone.Collection({model: EventModel});
cView = new CalendarView({model: new DateModel(new Date(2002, 2, 4))});
