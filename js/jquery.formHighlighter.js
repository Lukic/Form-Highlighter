/**
* Saucer.dk - FormHighlighter 
* Dependencies: FormHighlighter  2.0.4
* @version			2.0.4
* @license			MIT and GPL licenses.
* @Copyright		 (c) 2009 - 2012 Srdjan Lukic-Bardak
* @author			Srdjan Lukic-Bardak [ srdjan@lukic.nu ]
* @docmentation	http://www.saucer.dk/formhighlighter/
*/

//$.noConflict();
(function ($) {
    $.fn.formHighlighter = function (elementStyles) {

        var element = this;
        var opts = $.extend({}, $.fn.formHighlighter.defaults, elementStyles);
        $(document).ready(function () {


            $(element).find("input[type=text],input[type=password],input[type=email],input[type=url],input[type=number],input[type=range],input[type=search],input[type=color],input[type='Date picker'],textarea").each(function () {

                var standardValue = $(this).attr("value");
                var standardName = $(this).attr("name");
                
                //type: text,textarea
                if ($(this).is("input[type=text],input[type=password],input[type=email],input[type=url],input[type=number],input[type=range],input[type=search],input[type=color],input[type='Date picker'],textarea")) {

				//Adding placeholders
                if (placeholderSupport("input", "placeholder") == true && opts.clearField == true) {
                
                    $(this).attr("placeholder",standardValue)
                                .attr("value","")
                                .removeClass(opts.classFocus)
                                .removeClass(opts.classBlur)
                                .removeClass(opts.classKeyDown)
                                .removeClass(opts.classNotEqualToDefault)
                                .addClass(opts.classBlur);

                    if($(this).is("textarea")){ $(this).text(""); }

                }
                
                //Without placeholders
                else{
       
                	
                    $(this).attr("ref", standardValue);
                    if (opts.classBlur != "") {
                        $(this).removeClass(opts.classFocus)
                                    .removeClass(opts.classBlur)
                                    .removeClass(opts.classKeyDown)
                                    .removeClass(opts.classNotEqualToDefault)
                                    .addClass(opts.classBlur);
                    }
                  
                    }

                }
                
                //Type:password
                if ($(this).is("input[type=password]")) {

                    $(this).attr("ref", standardValue);
                    $(this).attr("temp","");

                    if (opts.classBlur != "") {
                        $(this).removeClass(opts.classFocus)
                                    .removeClass(opts.classBlur)
                                    .removeClass(opts.classKeyDown)
                                    .removeClass(opts.classNotEqualToDefault)
                                    .addClass(opts.classBlur);
                    }
                    
                    $(this).hide();
                    var MainClass = $(this).attr("class");
                    var MainId = $(this).attr("id") + " " + standardName;
                        $(this).after(
						$("<input>")
						            .attr("type", "text")
						            .attr("name", standardName + "_temp")
						            .attr("ref", standardValue)
						            .attr("typecheck", "password")
						            .attr("value", standardValue)
						            .attr("class", MainClass)
						            .attr("id", MainId)
						            .attr("autocomplete", "off")
						            .focus(function () { focusHandler(this); })
						            .blur(function () { blurHandler(this); })
						);
       
                }
                
                
                //Focuse handler
                $(this).focus(function () { focusHandler(this); });
               function focusHandler(obj) {
        			if ( $(obj).val() == $(obj).attr("ref") || $(obj).val() == $(obj).attr("placeholder") || $(obj).val() =="") {
                        var name = $(obj).attr("name");
                                              
                                       
                        // Using clearField option                      
                        if (opts.clearField == true) {
                        
                        	//Focus: Using placeholders
                            if (placeholderSupport("input", "placeholder") == true) {
                          
                                 if (opts.classFocus != "") {
                                        $(obj).removeClass(opts.classFocus)
                                    			   .removeClass(opts.classBlur)
                                    			   .removeClass(opts.classKeyDown)
                                    			   .removeClass(opts.classNotEqualToDefault)
                                          		   .addClass(opts.classFocus);
                                    }
                                    $(obj).val(""); 

                             }
                            
                            //Focus: Without placeholders
                            else {
                                          $(obj).val(""); 

                                   if (opts.classFocus != "") {
                                        $(obj).removeClass(opts.classFocus)
                                    			   .removeClass(opts.classBlur)
                                    			   .removeClass(opts.classKeyDown)
                                    			   .removeClass(opts.classNotEqualToDefault)
                                          		   .addClass(opts.classFocus);
                                    }
                             }
                        }
                        
                        // Without clearField option
                        else{
						
						// Set cursor to the begining
						
						var webkit = false;
						if($.browser.webkit){
						webkit = true;
						}
				
						//Find a new way to send type. To many options for something way to simple
						moveCursorToBegining(obj,name,webkit,$(obj).attr("type"));
						
                                              
                        if (opts.classFocus != "") {
                            			$(obj).removeClass(opts.classFocus)
                                    			   .removeClass(opts.classBlur)
                                    			   .removeClass(opts.classKeyDown)
                                    			   .removeClass(opts.classNotEqualToDefault)
                                          		   .addClass(opts.classFocus);
                        }
                        
                      }//clearField End

                    }

                    if (opts.onFocus != null) {
                        var onFocus = opts.onFocus || function() { };
                        $(obj).each(onFocus);
                    }


					//Keydown handler for Ctrl + v
					/*
					$(obj).keydown(function(e)
								{
								
									console.log(e.keyCode);
									if(e.keyCode === 86){

										$(obj).val("");

									}

								});*/
								
								
					var ctrl = false;      
					$(obj).keyup(function(e) {
					  if (e.keyCode == 17) ctrl = false;
					}).keydown(function(e) {
					  if (e.keyCode == 17) ctrl = true;
					  if (e.keyCode == 86 && ctrl) {
					    $(obj).val("");
					  }
					});				



					//Keypress handler
                    $(obj).keypress(function (event) {

                        if ($(obj).is("input[typecheck=password]")) {
                            var masterIDHolder = $(obj).attr("name");
                            var masterID = masterIDHolder.replace(/_temp/, "");
                            
								if ($.browser.msie || $.browser.opera) {
									if (_char != "") { var _char = String.fromCharCode(event.keyCode); }
									$(obj).remove();
									//$("input[name^=" + masterID + "]").css("display", "inline")
									$("input[name='" + masterID + "']").css("display", "inline")
											.focus()
											.removeClass(opts.classFocus)
											.removeClass(opts.classBlur)
											.removeClass(opts.classKeyDown)
											.addClass(opts.classKeyDown)
											.removeClass(opts.classNotEqualToDefault)
											.val("");
										   
									if ($.browser.msie) {
										//$("input[name^=" + masterID + "]").val(_char);
										$("input[name='" + masterID + "']").val(_char);
										
									  
									}
									
								   
								}
								else {
									
								
								
									if (_char != "") { var _char = String.fromCharCode(event.charCode); }
									$(obj).remove();
									//$("input[name^=" + masterID + "]").css("display", "inline")
									$("input[name='" + masterID + "']")
											.css("display", "inline")
											.removeClass(opts.classFocus)
											.removeClass(opts.classBlur)
											.removeClass(opts.classKeyDown)
											.removeClass(opts.classNotEqualToDefault)
											.addClass(opts.classKeyDown)
											.val("")
											.focus();
											if(!$.browser.webkit){
											$("input[name='" + masterID + "']").val(_char)
											}
								}
           
           					
                            

                        }
                        else {

                            if ($(obj).val() == $(obj).attr("ref") || $(obj).val() =="") {
                                $(obj).val("");
							
                                if (opts.classKeyDown != "") {
                                    $(obj).removeClass(opts.classFocus)
                                         .removeClass(opts.classBlur)
                                         .removeClass(opts.classKeyDown)
                                         .removeClass(opts.classNotEqualToDefault)
                                         .addClass(opts.classKeyDown);
                                }

                            }
                        }

                    });

                }
                
                
                //Blur handler
                $(this).blur(function () { blurHandler(this); });
                function blurHandler(obj) {
                    if ($(obj).is("input[type=password]")) {
                        if ($(obj).val() == "") {
                            $(obj).hide();
                            var MainClass = $(obj).attr("class");
                            var MainId = $(obj).attr("id") + " " + standardName;
                            $(obj).after(
								$("<input>")
								.attr("type", "text")
								.attr("name", standardName + "_temp")
								.attr("ref", standardValue)
								.attr("typecheck", "password")
								.attr("value", standardValue)
								.attr("class", MainClass)
								.attr("id", MainId)
								.attr("autocomplete", "off")
								.focus(function () { focusHandler(this); })
								.blur(function () { blurHandler(this); })
								);
                        }
                    }
                    else {
                        if ($(obj).val() == "") {
                            $(obj).val($(obj).attr("ref"));
                        }
                    }
                    if (opts.classBlur != "") {
                        $(obj).removeClass(opts.classBlur)
                                .removeClass(opts.classKeyDown)
                                .removeClass(opts.classFocus)
                                .removeClass(opts.classNotEqualToDefault)
                                .addClass(opts.classBlur);
                    }
                    
                  
                 
                    
                   if (opts.classNotEqualToDefault != "" && $(obj).val() != $(obj).attr("ref") && opts.clearField == false) 
					 {
						
							 $(obj).removeClass(opts.classFocus)
                        		   .removeClass(opts.classBlur)
                        		   .removeClass(opts.classKeyDown)
                        		   .removeClass(opts.classNotEqualToDefault)
                        		   .addClass(opts.classNotEqualToDefault);
					 }
				  if(placeholderSupport("input", "placeholder") == true && opts.clearField == true && opts.classNotEqualToDefault != "" && $(obj).val() != $(obj).attr("placeholder") && $(obj).val() !="")
					{

							 $(obj).removeClass(opts.classFocus)
                        		   .removeClass(opts.classBlur)
                        		   .removeClass(opts.classKeyDown)
                        		   .removeClass(opts.classNotEqualToDefault)
                        		   .addClass(opts.classNotEqualToDefault);

					}

                    if (opts.onBlur != null) {
                        var onBlur = opts.onBlur || function() { };
                        $(obj).each(onBlur);
                    }
                    

                }
                
                
                
                
            });
        });
    };
    
    //// Definding options
    $.fn.formHighlighter.defaults = {
        classFocus: '',
        classBlur: '',
        classKeyDown: '',
        classNotEqualToDefault: '',
        onBlur: null,
        onFocus: null,
        onKeypress:function() {},
        clearField: false
    };
    
    
})(jQuery);




//// moveCursorToBegining is used to move the cursor to the begining of inputfield.
//// But since every broswer has its own life, we need to do some silly checks.
//// This can be done more sexy, and should be rewritten.
function moveCursorToBegining(obj,name,webkit,type)
{
 if (obj.createTextRange) {
                            obj.focus();
                            var selRange = obj.createTextRange();
                            selRange.collapse(true);
                            selRange.moveStart("character", 0);
                            selRange.select();
                            
                                                       
                        } else if (obj.setSelectionRange) {
                            var objForm = document.forms[0].name;
                            var objName = name;
                            
                            if(webkit){
                            setTimeout(function() { setRange(obj,type) }, 10);
                            }
                            else
                            {
                            obj.setSelectionRange(0,0);
                            }
                            
                        } else {
                            if (obj.selectionStart) {
                                obj.focus();
                                obj.selectionStart = 0;
                            }
                            
                            obj.focus();
   
                        }
}


function setRange(obj,type) {
    obj.focus();
    if(type ==="password")
    {obj.setSelectionRange(1, 1);}
    else{
    obj.setSelectionRange(1, 0);
    }
    
}	


function placeholderSupport(element,attribute){

    var _temp = document.createElement(element);
    if(attribute in _temp){
    return true;
    }
    else{
    return false;
    }

}