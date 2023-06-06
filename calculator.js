function Row(row){
	var self = this;
	
	var row_div = $("<div class='row '></div>");
	var x = row_div;
	
	var data = {
		"input":$(), 		// construct
		"scale":(typeof row.scale != "undefined"? row.scale : 0), 			// construct
		// "depends":( typeof x.parent().depends != "undefined" ? x.parent().depends: {}), 			// dinamic

	}
	
	var d = data;
	var dd = d.depends;

	this.toHtml = function(){	return x;}
		
	this.inputChange = function(){
		if(x.find("input").attr("type") == "static"){
			return;
		}else{
			var	eval_string = d.scale.toString()
										.replace("d.unit", 1)
										.replace("dd.rate()", x.attr("rate_calculated")); 
										
			console.log("eval_string",eval_string);
			var data = {
				"scale":eval( eval_string ),
			};
			 data["unit"] = (d.input.val() / data.scale);
			
			log({"data":data,"msg":"Row.inputChange()","self":self,"name":"R:"+row.label,"unit":data.unit});
			
			x.parent().trigger( "calculate",data);
			log_end();
		}
	}
	
	this.addInput = function(){
		x.attr("scale",d.scale);
		x.attr("spec",d.spec);

		x.append(row.label);

		var right_div = $("<div class='right'></div>");
		x.append(right_div);

		var type = ( typeof row.type != "undefined" ? row.type : "");
		d.input = $("<input type='"+ type +"' class=' "+ row.sufix +" "+row.label+"'/>")
		right_div.append(d.input);
		d.input.on("change",self.inputChange )	 
		
		right_div.append($("<label class='sufix'>"+row.sufix+"</label>"));
	}
	
	__construct = function(self) {
		if(row.type=="empty"){
			x.addClass("empty");
		}else{
			self.addInput();
		}	
	}(this)
	
}



function Group(group){
	var self = this;
	
	var calculator_div = $('<div class="group '+group.name+'"><h2>'+group.name+'</h2></div>');
	var x = calculator_div;
	
	var data = {
		"filter_string": (typeof group.updates != "undefined" ? group.updates.map(function(el){return "."+el}).join(" , ") : ""), 
		"rows":[], 			// construct
		"sub_groups":[], 	// construct
		"depends":( typeof group.depends != "undefined" ? group.depends: {}), 			// dinamic
		"unit":1, 			// dinamic
		
	}
	var d = data;
	d.t = d.temp
	var dd = d.depends;
	
	this.toHtml = function(){	return x;}

	this.addRow = function(row) {
		if(row.type=="group"){
			$group = new Group(row.group);
			d.sub_groups.push($group) ;
			x.append($group.toHtml());
		}else{
			var $row = 	 new Row(row).toHtml();
			d.rows.push($row) ;
			x.append($row);
		}
	}
	
	this.updateRows = function() {
		x.children(".row:not(.empty)").each(function(){
			var row_div = $(this); 

			if(typeof dd.rate == "function"){
				row_div.attr("rate_calculated",  dd.rate());
				// console.log("dd rate",eval("dd.rate()"))
			}
			var new_value = eval(row_div.attr("scale")+""); 
			row_div.find("input:not([type='static'])").val( new_value);
		});
	}
	
	this.updateDependent = function() {
		if(typeof group.updates != "undefined"){
			log({"msg":"groups","name":"dependent ","self":self,"filter_string":d.filter_string,css:"color:#8f8"});
			var updateData = {"pending_update":d.filter_string , "unit":d.unit}
			x.parent().trigger("update",updateData);
			log_end();
		}
	}
	
	this.update = function(event,updateData) {
		log({"msg":"groups","name":"dependent ","self":self,"pending_update":updateData.pending_update,css:"color:#a0a"});
		updateData["stop_updating"] = 1;
		x.children(updateData.pending_update).trigger("calculate",updateData);
		log_end();
	}

	
	// main listener
	this.calculate = function(event,data) {
		log({"msg":"Group.calculate()","self":self,"name":"G:"+group.name,"unit":data.unit});
		event.stopPropagation();
		d.unit = data.unit;
				
		self.updateRows();
		if(typeof data["stop_updating"] == "undefined"){
			self.updateDependent();
		}
		log_end();
	}		
	
	__construct = function(self) {
		group.rows.map(self.addRow);
		x.on("calculate", function(event,unit){self.calculate(event,unit)} );
		x.on("update", function(event,unit){self.update(event,unit)} );
	}(this)
}


var groups = {};

$(function(){
	settings.groups.forEach(function(group){
		if(group.status==0){return}
		groups[group.name] = new Group(group);
		$(".page").append(groups[group.name].toHtml());
	})
});


