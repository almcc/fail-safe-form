(function( $ ) {
  $.fn.failSafeForm = function( options ) {

    // Create some defaults, extending them with any options that were provided
    var settings = $.extend( {
      'validate' : false
    }, options);

    return this.each(function(index, element) {

      var formId = $(element).attr("id");

      var loadTextBox = function( element )
      {
        var elementId = $(element).attr("id");
        var elementValue = localStorage.getItem(formId + "." + elementId);

        $(element).attr("value", elementValue);
      };

      var loadCheckBox = function( element )
      {
        var elementId = $(element).attr("id");
        var elementValue = localStorage.getItem(formId + "." + elementId);

        if(elementValue == "true"){
          console.log("attr");
          $(element).attr("checked","checked");
        } else {
          console.log("removeAttr");
          $(element).removeAttr("checked");
        }
      };

      var loadRadio = function( element )
      {
        var elementId = $(element).attr("name");
        var elementValue = localStorage.getItem(formId + "." + elementId);
        $("#" + elementValue).attr("checked","checked");
      };

      $(element).find("input").each(
        function(index, element)
        {
          switch($(element).attr("type"))
          {
            case "text":
              loadTextBox( element );
              $(element).on("blur", function(){
                var elementId = $(element).attr("id");
                var elementValue = $(element).attr("value");
                localStorage.setItem(formId + "." + elementId, elementValue);
              });
            break;

            case "checkbox":
              loadCheckBox( element );
              $(element).on("click", function(){
                var elementId = $(element).attr("id");
                var elementValue = $(element).attr("checked");
                if(elementValue == "checked"){
                  localStorage.setItem(formId + "." + elementId, "true");
                } else {
                  localStorage.setItem(formId + "." + elementId, "false");
                }
              });
            break;

            case "radio":
              // TODO : Could be improved, this will be called once
              // for every option, It only need to be called once.
              loadRadio( element );
              $(element).on("click", function(){
                var elementId = $(element).attr("name");
                var elementValue = $(element).attr("id");
                localStorage.setItem(formId + "." + elementId, elementValue);
              });
            break;
          }
        }
      );

    });
  };
})( jQuery );
