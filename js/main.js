(function(){
	
	"use strict"

	var EventModel = Backbone.Model.extend({
		default:{
			date: null,
			title: '',
			desc: ''
		}		
	});

	var events = new Backbone.Collection({model: EventModel});

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
			//функция генерирующая 
			//список дней по именам недели
			//или придумать что-то другое
			return [
				{day:"Понедельник", num:''},
				{day:"Вторник", num:1},
				{day: "Среда", num:2},
				{day: "Четверг", num:3},
				{day: "Пятница", num:4},
				{day: "Суббота", num:5},
				{day: "Воскресенье", num:6},
				{day: "Понедельник", num:7},
				{day: "Вторник", num:8},
				{day: "Среда", num:9},
				{day: "Четверг", num:10},
				{day: "Пятница", num:11},
				{day: "Суббота", num:12},
				{day: "Воскресенье", num:13},
				{day: "Понедельник", num:14},
				{day: "Вторник", num:15},
				{day: "Среда", num:16},
				{day: "Четверг", num:17},
				{day: "Пятница", num:18},
				{day: "Суббота", num:19},
				{day: "Воскресенье", num:20},
				{day: "Понедельник", num:21},
				{day: "Вторник", num:22},
				{day: "Среда", num:23},
				{day: "Четверг", num:24},
				{day: "Пятница", num:25},
				{day: "Суббота", num:26},
				{day: "Воскресенье", num:27},
				{day: "Понедельник", num:28},
				{day: "Вторник", num:29},
				{day: "Среда", num:30},
				{day: "Четверг", num:''},
				{day: "Пятница", num:''},
				{day: "Суббота", num:''},
				{day: "Воскресенье", num:''},


			];
		}
	});

	var CalendarView = Backbone.View.extend({
		render: function(){
			var val = this.model.GetDateString(),
				dayArr = this.model.GetDays(),
				calendarHTML = '<table>';

			_.each(dayArr, function(day, num) {
				if ((num % 7) == 0 || num == 0) {
					calendarHTML += '</tr><tr>';
				}
				calendarHTML += '<td>'  + day.num + '</td>';

			});

			calendarHTML += '<tr>';
			this.el.innerHTML = calendarHTML;  
			//var div = $('<div>').text(val);
			//console.log(val);
			//$('#events-calendar').append(div);
		},
		initialize: function(){
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

	var cView = new CalendarView({el: $("#events-calendar"), model: new DateModel(new Date(2002, 2, 4))});

})();