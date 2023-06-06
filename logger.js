var out  ;


function Debug(){
	var self = this ;
	var d = settings.debugging ; 
	
	this.log = function( ...logs ){
		if(d.logging==1){
			var log_1 =logs[0];
			var consoleGroupTitle ="%c" ;
			var css ;
			var cssForTypes = {"Row":"color:#f99","Group":"color:#99f"}
			
			
			if(typeof log_1 == "string"){
				consoleGroupTitle = log_1;
				css = "";
			}else{
				var type = log_1.self.constructor.name;
				out = log_1.self ;
				
				consoleGroupTitle += log_1["name"]+" "+log_1["msg"];
				css = cssForTypes[type];
				if(typeof log_1.css != "undefined"){
					css = log_1.css;
				}
			}		
			
			
			if(d.loggingCollapsed==1){
				console.groupCollapsed(consoleGroupTitle, css);
			}else{
				console.group(consoleGroupTitle, css);
			}

			logs.forEach(function(log){
				console.log(log);
				
				if(d.showTrace==1){
					console.groupCollapsed("trace")
						console.trace();
					console.groupEnd()
				}
			})
		}
		
	}

	this.log_end = function(){
		if(d.logging==1){
			console.groupEnd();
		}
	}

	this.toggleLogggig = function(btn){
		if(d.logging==1){
			d.logging = 0;
			$(btn).css('color','red')
		}else{
			d.logging = 1;
			$(btn).css('color','green')
		};
		
	}
	
	this.initializeToolbox = function(btn){
		$("body").append('<div class="tools"></div>');
		$(".tools").append('<button class="clear" onclick="console.clear()" >clear </button>');
		$(".tools").append('<button class="logging" onclick="toggleLogggig(this)" >logging </button>');	
	}

	__construct = function(self) {
			if(d.toolbox==1){
				self.initializeToolbox();
			}
			$(".tools .logging").css("color", (d.logging == 1 ? "green":"red" ) );
			if(d.testing==1){
				setTimeout(function(){
					console.group("testing")	
					// console.groupCollapsed("testing")	
					// var logging_orig = d.logging;
						$(".inch.diagonal").val(40).change();
					// d.logging = 0; 
						$(".resolution_x").val(1920).change();
						
						$("input.btc.usd").first().change();
						
						
 
						$("input.dolar").val(1).change();
						$("input.denar").val(checkPrice("usd","eur")*61.17).change();
						$("input.evro").val(checkPrice("usd","eur")).change();
						$("input.bitcoin").val(checkPrice("usd","btc")).change();
						$(".group.rates input.unit").val(0).change();
						
					// d.logging = logging_orig;
					console.groupEnd("testing")	
				},100)
			}
		
	}(this)

}

$(function(){
	var debug = new Debug();
	log = debug.log;
	log_end = debug.log_end;
});