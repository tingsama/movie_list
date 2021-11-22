d3.json("movie.json").then(function(data) {
	// get the data
	data = JSON.parse(JSON.stringify(data)).data
	console.log(data)

	var titleArr = [], runtimeArr = [], budgetArr = [], directedArr = [], dateArr = []
	data.forEach(d=>{
		d.title = d.Title
		d.runtime = parseInt(d.Running_time)
		d.budget = parseInt(d.Budget) 
		d.boxoffice = parseInt(d.Box_office) 
		d.directed = d.Directed_by 
		d.date = Date.parse(d.Release_date) 
	})

	// set the dimensions and margins of the graph
	const margin = {
		top: 30,
		right: 120,
		bottom: 120,
		left: 90
	}
	const width = 1000 - margin.left - margin.right
	const height = 500 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	const svg = d3.select("#data_visualize")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

  	// x axis
	const x = d3.scaleBand()
  		.domain(data.map((d) => d.title))
  		.range([0, width])
	 	.padding(0.2);
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
		.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("font-size", "12px")
			.style("text-anchor", "end");

	// text label for the x axis
	svg.append("text")           
		.attr("transform",
			"translate(" + (width + 10) + " ," + 
						(height + 5) + ")")
		.style("text-anchor", "start")
		.text("Movie Name");

	// y axis
	const y = d3.scaleLinear()
		.domain([0, 1])
		.range([height, 0]);
	svg.append("g")
		.attr("class", "my_y_axis")
		.call(d3.axisLeft(y))


	// create and update the plot 
	function update(data, var_1, var_2) {
		// y axis
		y_max = d3.max(Array.from(data, (d) => d[var_2]))
		y.domain([0, y_max])
		svg.selectAll("g.my_y_axis")
			.transition().duration(1000)
			.call(d3.axisLeft(y));

		// append the bar rectangles to the svg element
		svg.selectAll("rect")
			.data(data)
			.join(
				enter => {
					enter.append('rect')
					.attr("x", (d) => x(d[var_1]))
					.attr("y", (d) => y(d[var_2]))
					.attr("width", x.bandwidth())
					.attr("height", (d) => height - y(d[var_2]))
					.attr("fill", "#85a9a2")
				},
				update => {
					update.transition().duration(1000)
					.attr("x", (d) => x(d[var_1]))
					.attr("y", (d) => y(d[var_2]))
					.attr("width", x.bandwidth())
					.attr("height", (d) => height - y(d[var_2]))
					.attr("fill", "#85a9a2")

					// text label for the y axis
					svg.append("text")
					.attr("class", "my_y_label")
					.attr("transform",
						"translate(" + (-30) + " ," + 
									(-10) + ")")
					.style("text-anchor", "start")
					.text(var_2);
				},
				exit => 
					exit.remove(),
					svg.selectAll("text.my_y_label").remove(),
			)
	}

	update(data, 'title', 'runtime')

	document.querySelector("#runtime").addEventListener('click', ()=> {
		update(data, 'title', 'runtime')
	})
	document.querySelector("#budget").addEventListener('click', ()=> {
		update(data, 'title', 'budget')
	})
	document.querySelector("#boxoffice").addEventListener('click', ()=> {
		update(data, 'title', 'boxoffice')
	})
})
