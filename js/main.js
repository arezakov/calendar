(function(){
	
	"use strict"

    var Event = Backbone.Model.extend({
	    defaults: {
	        photo: "/img/placeholder.png"
	    }
	});

	var Events = Backbone.Collection.extend({
	    model: Event
	});

	var events = new Events();

	var EventView = Backbone.View.extend({
	    tagName: "article",
	    className: "contact-container",
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
	        this.collection = events;
	        this.render();
	    },

	    render: function () {
	        var that = this;
	         this.$el.html('');
	        _.each(this.collection.models, function (item) {
	            that.renderEvent(item);
	        }, this);

	        this.$el.prepend('<input type="button" value="Создать событие">');
	    },

	    renderEvent: function (item) {
	        var eventView = new EventView({
	            model: item
	        });
	        this.$el.append(eventView.render().el);
	    },
	    events: {
	    	"click input": "addEvent",
	    },
	    addEvent: function() {
	    	this.collection.add({date: new Date(), title:'новое событие', desc: 'Описание нового события'});
	    	console.log(this.collection);
	    }
	});

	var eventsListView = new EventsListView();
	eventsListView.listenTo(events, 'add', eventsListView.render);

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

	var FullCalendarView = Backbone.View.extend({
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
				calendarHTML += '<td class="' + (day.num != '-' ? 'date ' : '') + (day.today == true ? 'today ' : '') + '">'  + day.num + '</td>';

			});

			calendarHTML += '</tr></tbody></table>';

			this.el.innerHTML = calendarHTML;  

			return this;
		},
		events: {
			"click .monthPrev": "monthPrev",
			"click .monthNext": "monthNext",
			"click .date": "select"
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
	        new EventDialogView().render();
	    },
	});
	
	var EventDialogView = Backbone.View.extend({
	    el: $('#event-dialog'),
	    render: function() {
	    	$.fancybox( this.$el, {});
	        return this;
	    },
	    
	});

	var dateModel = new DateModel();
	var fullCalendarView = new FullCalendarView({el: $("#events-calendar"), model: dateModel});
	fullCalendarView.listenTo(dateModel, 'change', fullCalendarView.render);



})();