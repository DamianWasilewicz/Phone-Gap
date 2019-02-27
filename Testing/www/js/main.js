var app = {
  //When typing names into search window, show suggested names from employees collection
  findByName: function() {
    var self = this;
    this.store.findByName($('.search-key').val(), function(employees) {
        $('.employee-list').html(self.employeeLiTpl(employees));
    });
},
  //initializes application and chooses view (home or employee)
    initialize: function() {
    var self = this;
    this.detailsURL = /^#employees\/(\d{1,})/;
    this.store = new MemoryStore(function() {
        self.showAlert('Store Initialized', 'Info');
        self.route();
    });
    this.homeTpl = Handlebars.compile($("#home-tpl").html());
    this.employeeLiTpl = Handlebars.compile($("#employee-li-tpl").html());
    self.registerEvents();
},

//If application is native (on phone and emulator) show native notification; else show default notification
    showAlert: function (message, title) {
    if (navigator.notification) {
        navigator.notification.alert(message, null, title, 'OK');
    } else {
        alert(title ? (title + ": " + message) : message);
    }
},
renderHomeView: function() {
    $('body').html(this.homeTpl());
    $('.search-key').on('keyup', $.proxy(this.findByName, this));
},
//js for registering events, like clicking on employee names
registerEvents: function() {
    var self = this;
    // Check of browser supports touch events...
    $(window).on('hashchange', $.proxy(this.route, this));
    if (document.documentElement.hasOwnProperty('ontouchstart')) {
        // ... if yes: register touch event listener to change the "selected" state of the item
        $('body').on('touchstart', 'a', function(event) {
            $(event.target).addClass('tappable-active');
        });
        $('body').on('touchend', 'a', function(event) {
            $(event.target).removeClass('tappable-active');
        });
    } else {
        // ... if not: register mouse events instead
        $('body').on('mousedown', 'a', function(event) {
            $(event.target).addClass('tappable-active');
        });
        $('body').on('mouseup', 'a', function(event) {
            $(event.target).removeClass('tappable-active');
        });
    }
},
route: function() {
  var hash = window.location.hash;
  if (!hash) {
      $('body').html(new HomeView(this.store).render().el);
      return;
  }
  var match = hash.match(app.detailsURL);
  if (match) {
      this.store.findById(Number(match[1]), function(employee) {
          $('body').html(new EmployeeView(employee).render().el);
      });
  }
},


};

app.initialize();
