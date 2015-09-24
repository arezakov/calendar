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
			if (cur_date) {
				this.set({date: cur_date});
			} else {
				this.set({date: new Date() });
			}

			
		},
		GetDateString: function(){
			return "year: " + this.get('date').getMonth() + "month: " + this.get('date').getFullYear();
		},
		GetMonth: function(){
			var month = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
			return month[this.get('date').getMonth()];
		},
		GetYear: function(){
			return this.get('date').getFullYear();
		},
		GetDays: function(){
			var year = this.get('date').getFullYear(),
				month = this.get('date').getMonth(),
				date = this.get('date').getDate(),
				todayFlag = false,
				todayDate = new Date(),
				todayYear = todayDate.getFullYear(),
				todayMonth = todayDate.getMonth(),
				todayDay = todayDate.getDate();

			var result = [],
				dayNum = 1,
				lastDay = new Date(year, month+1, 0).getDate(), //Сколько дней
                dnFirst = new Date(year, month, 1).getDay(), //день недели первого дня месяца
                dnLast = new Date(year, month, lastDay).getDay(); //день недели последнего дня месяца

            for (var i = 1; i <= 42; i++) {
            	todayFlag = false;
            	if ((i < dnFirst) || (dayNum > lastDay)) {
            		result.push({day:'', num:'-'});
            		continue;
            	}
            	if(year == todayYear && month == todayMonth && dayNum == todayDay) {
            		todayFlag = true;
            	}
            	result.push({day:'', num: dayNum++, today: todayFlag});

            };

			return result;
		}
	});

	var CalendarView = Backbone.View.extend({
		render: function(){
			var val = this.model.GetDateString(),
				dayArr = this.model.GetDays(),
				month = this.model.GetMonth(),
				year = this.model.GetYear(),
				calendarHTML = '<table>\
					<thead>\
						<tr>\
							<td class="monthPrev">‹</td>\
							<td colspan="5">' + month + ' ' + year + '</td>\
							<td class="monthNext">›</td>\
						</tr>\
						<tr>\
							<td>Пн</td>\
							<td>Вт</td>\
							<td>Ср</td>\
							<td>Чт</td>\
							<td>Пт</td>\
							<td>Сб</td>\
							<td>Вс</td>\
						</tr>\
					</thead>\
					<tbody>';
					

			_.each(dayArr, function(day, num) {

				if (num == 0) {
					calendarHTML += '<tr>';
				}
				if ((num % 7) == 0 && num != 0) {
					calendarHTML += '</tr><tr>';
				}
				calendarHTML += '<td class="' + (day.today == true ? 'today' : '') + '">'  + day.num + '</td>';

			});

			calendarHTML += '</tr></tbody></table>';

			this.el.innerHTML = calendarHTML;  

			return this;
		},
		events: {
			"click .monthPrev": "monthPrev",
			"click .monthNext": "monthNext",

		},
		monthPrev: function() {
			this.model.set({date: new Date(this.model.get('date').getFullYear(), this.model.get('date').getMonth() - 1, 1)});
		},
		monthNext: function() {
			this.model.set({date: new Date(this.model.get('date').getFullYear(), this.model.get('date').getMonth() + 1, 1)});
		},
		initialize: function(){
			this.render();
		}
	});
	var dateModel = new DateModel();
	var cView = new CalendarView({el: $("#events-calendar"), model: dateModel});
	cView.listenTo(dateModel, 'change', cView.render);

})();