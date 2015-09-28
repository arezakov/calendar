(function(){
	
	"use strict"

	var Event = Backbone.Model.extend({
		defaults: {
			date: null,
			title: ''
		},
		checkMonth: function(month) {
			return month == this.get("date").getMonth();
		},
		checkYear: function(year) {
			return year == this.get("date").getFullYear();
		},
		checkDay: function(dayNum) {
	   		return dayNum == this.get("date").getDate();
	   	},
	   	checkDate: function (year, month, day) {
	   		return this.checkMonth(month) && this.checkYear(year) && this.checkDay(day)
	   	}
	});

	var Events = Backbone.Collection.extend({
		model: Event
	});


	var EventItemView = Backbone.View.extend({
		tagName: "article",
		className: "ivent-list-container",
		template: $("#eventTemplate").html(),

		render: function () {
			var tmpl = _.template(this.template);

			this.$el.html(tmpl(this.model.toJSON()));
			return this;
		}
	});

	var EventsListView = Backbone.View.extend({
		el: $("#events-list"),

		initialize: function () {
			this.collection = events; //переменной
			this.render();
		},

		render: function () {
			var that = this;
			 this.$el.html('');
			 if (this.collection.models.length) {
			 	_.each(this.collection.models, function (item) {
					that.renderEvent(item);
				}, this);
				 this.$el.closest('.events').addClass('has-events');
				} else {
					this.$el.closest('.events').removeClass('has-events');
				}
			;
		},

		renderEvent: function (item) {
			var eventItemView = new EventItemView({
				model: item
			});
			this.$el.append(eventItemView.render().el);
		}
	});

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
			return {
				rusNameMonth: month[this.get('date').getMonth()],
				numberMonth: this.get('date').getMonth()
			};
		},
		GetYear: function(){
			return this.get('date').getFullYear();
		},
		GetDays: function(){
			var CALENDAR_CELLS = 42;
			var year = this.get('date').getFullYear(), 
				month = this.get('date').getMonth(),   
				date = this.get('date').getDate(),	 
				todayFlag = false,
				todayDate = new Date(),
				todayYear = todayDate.getFullYear(),
				todayMonth = todayDate.getMonth(),
				todayDay = todayDate.getDate(),
				evcid = '';

			var result = [],
				dayNum = 1,
				lastDay = new Date(year, month+1, 0).getDate(), //Сколько дней в этом месяце
				dnFirst = new Date(year, month, 1).getDay(), //день недели первого дня месяца
				dnLast = new Date(year, month, lastDay).getDay(); //день недели последнего дня месяца
		  
			for (var i = 1; i <= CALENDAR_CELLS; i++) {
				todayFlag = false;
				evcid = '';
				if ((i < dnFirst) || (dayNum > lastDay)) {
					result.push({day:'', num:''});
					continue;
				}
				if (year == todayYear && month == todayMonth && dayNum == todayDay) {
					todayFlag = true;
				}

				events.each(function(item){ 
					if (item.checkDate(year, month, dayNum)) {
						evcid = item.cid;
					}
				});

				result.push({day:'', num: dayNum++, today: todayFlag, evcid: evcid});
			};
			return result;
		}
	});

	var FullCalendarView = Backbone.View.extend({

		template: $("#calendarTemplate").html(),

		render: function(){
			var dayArr = this.model.GetDays(),
				month = this.model.GetMonth().rusNameMonth,
				year = this.model.GetYear(),
				tmpl = _.template(this.template),
				calendarHTML = '';
					
			_.each(dayArr, function(day, num) {

				if (num == 0) 
					calendarHTML += '<tr>';
				
				if ((num % 7) == 0 && num != 0) 
						calendarHTML += '</tr><tr>';

				calendarHTML += '<td '+ (day.evcid ? 'data-evcid="'+day.evcid+'"' : '') +' class="' + (day.num && !day.evcid ? 'date ' : '') + (day.today == true ? 'today ' : '') + (day.evcid ? 'has-event' : '') +' ">'  + day.num + '</td>';
			});

			calendarHTML += '</tr>';

			this.$el.html(tmpl({
				year: year,
				monthMumber: this.model.GetMonth().numberMonth,
				month: month,
				calendarHTML: calendarHTML
			}));

			return this;
		},
		events: {
			"click .monthPrev": "monthPrev",
			"click .monthNext": "monthNext",
			"click .date": "select",
			"click .has-event": "changeEvent"
		},
		monthPrev: function() {
			this.model.set({date: new Date(this.model.get('date').getFullYear(), this.model.get('date').getMonth() - 1, 1)});
		},
		monthNext: function() {
			this.model.set({date: new Date(this.model.get('date').getFullYear(), this.model.get('date').getMonth() + 1, 1)});
		},
		initialize: function(){
			this.render();
		},
		select: function(selectDate) {
			this.eventView = new EventView();
			this.eventView.collection = this.collection;
			this.eventView.model = new Event();
			this.eventView.selectDate = selectDate.target.textContent;
			this.eventView.render();
		},
		changeEvent: function(fcEvent){
	 		this.eventView.model = this.collection.get($(fcEvent.target).attr("data-evcid"));
			this.eventView.render();
		}
	});
	
	var EventView = Backbone.View.extend({
		el: $('#event-dialog'),
		initialize: function() {
			_.bindAll(this, 'save', 'close', 'open', 'remove');
		},
		render: function() {
			var buttons = {'Сохранить': this.save};
			if (this.model.hasChanged()) {
				_.extend(buttons, {'Удалить': this.remove});
			}
	   		_.extend(buttons, {'Отмена': this.close});

				this.$el.dialog({
					modal: true,
					title: (!this.model.hasChanged() ? 'Добавить' : 'Редактировать') + ' событие',
					buttons: buttons,
					open: this.open,
					minWidth: 400,
				});
	 
			return this;
		},
		close: function() {
			this.$el.find('.field').val('');
			this.$el.dialog('close');
		},
		open: function() {
			this.$('#event-dialog-title').val(this.model.get('title'));
			this.$('#event-dialog-desc').val(this.model.get('desc'));
		},
		save: function() {
			if (!this.model.hasChanged()) {
				var newEventYear = fullCalendarView.$el.children('table').attr("data-year");
				var newEventMonth = fullCalendarView.$el.children('table').attr("data-month");
				var newEventDay = this.selectDate;
				this.model.set({'date': new Date(newEventYear, newEventMonth, newEventDay), 'title': this.$('#event-dialog-title').val(), 'desc': this.$('#event-dialog-desc').val()});
		   		 this.collection.add(this.model);
			} else {
				this.model.set({'title': this.$('#event-dialog-title').val(), 'desc': this.$('#event-dialog-desc').val()});
			}
			this.close();
		},
		remove: function() {
			this.model.destroy({success: this.close});
		}

	});

	var events = new Events();

	var dateModel = new DateModel();

	var fullCalendarView = new FullCalendarView({el: $("#events-calendar"), model: dateModel,  collection: events});
	fullCalendarView.listenTo(dateModel, 'change', fullCalendarView.render);
	fullCalendarView.listenTo(events, 'all', fullCalendarView.render);


	var eventsListView = new EventsListView();
	eventsListView.listenTo(events, 'all', eventsListView.render);

})();
>>>>>>> remotes/origin/master
