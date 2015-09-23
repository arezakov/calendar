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
			//console.log("Month: " + this.date.getMonth() + " Year: " + this.date.getFullYear());
			var year = this.date.getFullYear(),
				month = this.date.getMonth();

			var result = [],
				dayNum = 1,
				lastDay = new Date(year, month+1, 0).getDate(), //Сколько дней
                dnFirst = new Date(year, month, 1).getDay(), //день недели первого дня месяца
                dnLast = new Date(year, month, lastDay).getDay(); //день недели последнего дня месяца

            for (var i = 1; i <= 42; i++) {
            	if ((i < dnFirst) || (dayNum > lastDay)) {
            		result.push({day:'', num:'-'});
            		continue;
            	}
            	result.push({day:'', num: dayNum++});

            };

			console.log(lastDay);
			console.log(dnFirst);
			console.log(dnLast);

			return result;
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

			/*var val = this.model.GetDateString();
			var div = $('<div>').text(val);
			console.log(val);
			$('#events-calendar').append(div);*/
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

	var cView = new CalendarView({el: $("#events-calendar"), model: new DateModel()});

})();