var keys = ['t', 'v','in','ik','n','m','h'];
var keyToTitleMapping = {
	't':   'Time (mS)',
	'v':   'Voltage (mV)', 
	'in':  'Ina (A?)', 
	'ik':  'Ik (A?)',
	'n':   'N',
	'm':   'M',
	'h':   'H',
};
function create_dataset(vs,vi,ns,dt,pn, useArr) {
	var hh_basic_data = get_hh_solution(vs,vi,ns,dt,pn);
	var output_arr = [];
	var data_len = hh_basic_data[useArr[0]].length;
	for(var i = 0; i < data_len; ++i) {
		var arr = []
		for(var j = 0; j < useArr.length; ++j) {
			arr = arr.concat(hh_basic_data[useArr[j]][i]);
		}
		output_arr.push(arr);
	}
	return output_arr;
}

function getNumber(s){
	return Number(document.getElementById(s).value);
}
document.getElementById("reeval-btn").onclick = reevaluate;

function getUseArr() {
	var cboxes = document.querySelectorAll(":checked");
	var arr = ['t',];
	for(var i = 0; i < cboxes.length; ++i) {
		var m = /check_(\w+)/.exec(cboxes[i].id);
		if(m) {
			arr.push(m[1]);
		}
	}
	return arr;
}
function reevaluate(e) {
	e.preventDefault();
	var vs = getNumber("v_stimulus");
	var v0 = getNumber("v_init");
	var ns = getNumber("n_steps");
	var dt = getNumber("dt");
	var pn = getNumber("print_every_n");
	var useArr = getUseArr();
	var dataset = create_dataset(vs,v0,ns,dt,pn, useArr);
	drawChart(dataset, useArr);
	dataset = create_dataset(vs,v0,ns,dt,pn, keys);
	fillTable(dataset);
}

function make_row(arr){
	var tr = document.createElement('tr');
	for(var i = 0; i < arr.length; ++i) {
		var td = document.createElement('td');
		td.textContent = arr[i];
		tr.appendChild(td);
	}
	return tr;
}

function fillTable(dataset){
	var tbody = document.getElementById("results").children[0];
	var t_children = tbody.children;
	//Delete all, but first
	while(tbody.children.length > 1) {
		tbody.removeChild(tbody.children[1]);
	}
	//Add row at a time
	for(var i = 0; i < dataset.length; ++i) {
		tbody.appendChild(make_row(dataset[i]));
	}
}
google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(reevaluate);
function drawChart(dataset, useArr) {
	var dataTitles = [];
	for(var i = 0; i < useArr.length; ++i) {
		dataTitles = dataTitles.concat(keyToTitleMapping[useArr[i]]);
	}
	console.log(dataTitles);
	var data = google.visualization.arrayToDataTable(
			[dataTitles].concat(dataset)
			);

	var options = {
	   title: 'Hodgkin & Huxley Solver',
	   hAxis: {title: 'Time (ms)',  titleTextStyle: {color: '#333'}},
	   vAxis: {title: 'Voltage (mV)', minValue: 0},
	   animation: {duration: 1000, startup: true, easing: 'linear'},
	   chartArea: {left: '10%'},
	};

	var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
	chart.draw(data, options);
}

