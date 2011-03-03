var Com = Backbone.Model.extend({
  initialize: function () {
    if(!this.get("user_agent") && navigator && navigator.userAgent) {
      this.set({"user_agent": navigator.userAgent});
    }
    if(this.get("_id")) {
      this.set({id: this.get('_id')});
    }
  },

  clear: function() {
    this.destroy();
    this.view.remove();
  }
});


var ComList = Backbone.Collection.extend({
  model: Com,

  initialize: function() {
    this.url = "/coms";
  }
});


var ComView = Backbone.View.extend({
  tagName: "li",

  events: {
    "dblclick .com-text":  "edit",
    "click .com-destroy":  "clear",
    "keypress .com-input": "updateOnEnter",
    "focus .com-input":    "startEditing",
    "blur .com-input":     "stopEditing",
  },

  initialize: function() {
    _.bindAll(this, 'render', 'close');
    this.model.bind('change', this.render);
    this.model.view = this;
    this.input = this.$('.com-input');
  },

  render: function() {
    $(this.el).html(ich.com_template(this.model.toJSON()));
    this.setText();
    return this;
  },

  setText: function () {
    var text = this.model.get('text');
    this.$('.com-text').text(text);
    this.input.val(text);
  },

  edit: function() {
    $(this.el).addClass("editing");
    this.input.focus();
  },

  close: function() {
    this.model.set({ text: this.input.val() });
    if(this.model.hasChanged) {
      this.model.save();
    }
    $(this.el).removeClass("editing");
  },

  updateOnEnter: function(e) {
    if (e.keyCode === 13) { this.close(); }
  },

  startEditing: function() {
    this.$(".com-input").addClass('expanded');
  },

  stopEditing: function() {
    this.close();
    this.$(".com-input").removeClass('expanded');
  },

  remove: function() {
    $(this.el).remove();
  },

  clear: function() {
    this.model.clear();
  }
});

var AppView = Backbone.View.extend({

  el: $('#comapp'),

  events: {
    "focus #new-com":    "startEditing",
    "blur #new-com":     "stopEditing",
    "keypress #new-com": "createOnEnter",
    "click .title":      "fetch"
  },

  initialize: function() {
    _.bindAll(this, 'addOne', 'addAll', 'refresh', 'clear');

    this.input = this.$("#new-com");
    this.input.qtip({
      content: "Press Enter to save...",
      position: {
        corner: {
          target: "rightMiddle",
          tooltip: "leftMiddle"
        }
      },
      style: {
        name: "green"
      },
      tip: "leftMiddle",
      show: false,
      hide: false
    });
    //this.tooltip = this.$(".ui-tooltip-top")

    this.com_list = new ComList();
    this.com_list.bind('add',     this.addOne);
    this.com_list.bind('refresh', this.addAll);
    this.com_list.bind('all',     this.render);
  },

  fetch: function() {
    this.clear();
    this.com_list.fetch();
  },

  refresh: function(data) {
    this.com_list.refresh(data);
  },

  clear: function() {
    this.com_list.each(function(com) { com.view.remove(); });
  },

  addOne: function(com) {
    var view = new ComView({model: com});
    this.$("#com-list").append(view.render().el);
  },

  addAll: function() {
    this.com_list.each(this.addOne);
  },

  newAttributes: function() {
    return { text: this.input.val() };
  },

  createOnEnter: function(e) {
    if (e.keyCode !== 13) { return; }
    this.com_list.create(this.newAttributes());
    this.input.val('');
  },

  startEditing: function() {
    this.input.stop().animate({
      "height": "96px",
    }, "fast").addClass("expanded").qtip('show');

    //this.tooltip.fadeIn();
  },

  stopEditing: function() {
    this.input.stop().animate({
      "height": "32px",
    }, "fast").removeClass("expanded").qtip('hide');

    //this.tooltip.fadeOut();
  }
});
