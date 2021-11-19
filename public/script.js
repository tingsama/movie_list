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
		right: 30,
		bottom: 120,
		left: 90
	}
	const width = 800 - margin.left - margin.right
	const height = 600 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	const svg = d3.select("#data_visualize")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

  	// X axis
	const x = d3.scaleBand()
  		.domain(data.map((d) => d.title))
  		.range([0, width])
	 	.padding(0.2);

	svg.append("g")
		.attr("transform", `translate(0,${height})`)
		.call(d3.axisBottom(x))
		.selectAll("text")
		  .attr("y", 0)
		  .attr("x", 9)
		  .attr("dy", ".35em")
		  .attr("transform", "rotate(90)")
		  .style("text-anchor", "start");

	// Y axis
	const y = d3.scaleLinear()
		.domain([0, 1])
		.range([height, 0]);
	svg.append("g")
		.attr("class", "myYaxis")
		.call(d3.axisLeft(y));


	// create and update the plot 
	function update(data, var_1, var_2) {
		// Y axis
		y_max = d3.max(Array.from(data, (d) => d[var_2]))
		y.domain([0, y_max])
		svg.selectAll("g.myYaxis")
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
					.attr("fill", "#69b3a2")
				},
				update => 
					update.transition().duration(1000)
					.attr("x", (d) => x(d[var_1]))
					.attr("y", (d) => y(d[var_2]))
					.attr("width", x.bandwidth())
					.attr("height", (d) => height - y(d[var_2]))
					.attr("fill", "#69b3a2")
					.attr("width", x.bandwidth()),
					
				rectsToRemove => 
					rectsToRemove.remove()
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
