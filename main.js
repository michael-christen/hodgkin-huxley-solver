function create_dataset(vs,vi,ns,dt,pn) {
	var r = [];
	var hh_basic_data = get_hh_solution(vs,vi,ns,dt,pn);
	return hh_basic_data;
	/*
	   for(var i = 0; i < hh_basic_data.length; ++i){
	   var d = hh_basic_data[i];
	   r['labels'].push(d[0]);
	   r['data'].push(d[1]);
	   console.log(d[0] + ", " + d[1]);
	   }
	 */
	return r;
}

function getNumber(s){
	return Number(document.getElementById(s).value);
}
document.getElementById("reeval-btn").onclick = reevaluate;
function reevaluate(e) {
	e.preventDefault();
	var vs = getNumber("v_stimulus");
	var v0 = getNumber("v_init");
	var ns = getNumber("n_steps");
	var dt = getNumber("dt");
	var pn = getNumber("print_every_n");
	var dataset = create_dataset(vs,v0,ns,dt,pn);
	drawChart(dataset);
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
function drawChart(dataset) {
	var data = google.visualization.arrayToDataTable(
			[['Time (ms)', 'Voltage (mV)']].concat(dataset)
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

