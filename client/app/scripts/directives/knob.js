/**
 * Created by Tyler on 3/19/2015.
 */
//jquery-knob directive
angular.module('clientApp').directive('knob', function() {

  function link( scope, element , attr ) {

    function draw() {

      element.empty();

      var tmpl = $('<input type="text">');

      var min = attr.min ? parseInt(attr.min) : 0;
      var max = attr.max ? parseInt(attr.max) : 0;
      var val = attr.value ? parseInt(attr.value) : "";
      var readonly = attr.readonly == "true";
      var sign = attr.sign ? attr.sign : "";
      var fgColor = "#00A65A"; //green - success

      var dangerLimit = attr.dangerLowerThen;
      var warnLimit = attr.warnLowerThen;

      if(dangerLimit && val < dangerLimit) {
        fgColor = "#F56954"; //red - danger
      } else if(warnLimit && val < warnLimit) {
        fgColor = "#F39C12"; //yellow - warning
      }

      element.append(tmpl);

      var options = {
        value : 0,
        min : min,
        max : max > val ? max : val,
        dynamicDraw: true,
        fgColor : fgColor,
        readOnly : readonly,
        rtl : (attr.dir == 'rtl'),
        draw : function () { $(this.i).val(this.cv + sign); }
      };
      tmpl.knob(options);

      tmpl.animate({
        value: 100
      }, {
        duration: 1000,
        easing: 'swing',
        progress: function () {
          $(this).val(Math.round(this.value/100 * val)).trigger('change');
        }
      })

    }

    scope.$watch(function () {
      return [attr.value, attr.max, attr.min , attr.readonly];
    }, draw, true);

  }

  return {
    priority: 99,
    restrict: 'A',
    link : link
  };
});