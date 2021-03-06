
document.addEventListener("DOMContentLoaded", function() {

	document.getElementById("svg-text")
	.textContent += 'You can customize the likes by clicking the rectangle of the movie!';
	
	var data = [];
	// fetch data from info 
	fetch('/info').then(response=>response.json()).then(xdata=>{
		data = xdata.data; 

		data.forEach(d=>{
			d.title = d.Title
			d.runtime = parseInt(d.Running_time)
			d.budget = parseInt(d.Budget) 
			d.boxoffice = parseInt(d.Box_office) 
			d.like = d.Like 
		})

		// set the dimensions and margins of the graph
		const margin = {
			top: 30,
			right: 120,
			bottom: 120,
			left: 90
		}
		const width = 1000 - margin.left - margin.right
		const height = 400 - margin.top - margin.bottom;

		/* 
		Source link: https://www.d3-graph-gallery.com/graph/barplot_button_data_simple.html 
		Use the templete of x and y component from svg, eg: scaleBand() and linearBand()
		Different: the size and details of the components are modified 
		*/ 
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
			.text("movie name");

		// y axis
		const y = d3.scaleLinear()
			.domain([0, 1])
			.range([height, 0]);
		svg.append("g")
			.attr("class", "my_y_axis")
			.call(d3.axisLeft(y))

		/* 
		Source link: https://perials.github.io/responsive-bar-chart-with-d3/ 
		Use the similar tooltip component, active the tooltip when mouse hover the rect
		Different: Tooltip style are modified, movie title will showup instead of the digital data 
		*/
		var tooltip = d3.select("#data_visualize")
			.append("div")
			.style("position", "absolute")
			.style("visibility", "hidden")
			.style("padding", "5px")
			.style("color", "#ebf8e1")
			.style("background", "rgba(0,0,0,0.5)")
			.style("border-radius", "5px")
			.text("tooltip");
			
		// create and update the plot 
		function update(data, var_1, var_2) {
			// y axis
			y_max = d3.max(Array.from(data, (d) => d[var_2]))
			y.domain([0, y_max])
			svg.selectAll("g.my_y_axis")
				.transition().duration(1000)
				.call(d3.axisLeft(y));

			/* 	
			Source link: d3Easy.html 
			Use the templete of join, eg: the enter, update, exit structure
			Different: the other append attributes are self defined
			eg: x and y values, mouseover, mousemove, mouseout event, text component, and remove() function
			*/
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
						.on("mouseover", function(d, i) {
							tooltip.html(`${i[var_1]}`).style("visibility", "visible");
							d3.select(this)
								.attr("fill", "#334f5b");
						})
						.on("mousemove", function(){
						tooltip
							.style("top", (event.pageY-10)+"px")
							.style("left",(event.pageX+10)+"px");
						})
						.on("mouseout", function(d, i) {
							tooltip.html(``).style("visibility", "hidden");
							d3.select(this)
								.attr("fill", "#85a9a2");
						});
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
		document.querySelector("#like").addEventListener('click', ()=> {
			update(data, 'title', 'like')

			// add click event
			document.querySelectorAll('rect')
				.forEach(rect => rect.setAttribute('decrease', false))

			document.querySelectorAll('rect')
				.forEach((rect,i) => rect.addEventListener('click', ()=>{
				
				let updated_like = data[i-1].Like;

				if (updated_like == 5) rect.setAttribute('decrease',true);
				if (updated_like == 1) rect.setAttribute('decrease',false);

				if (rect.getAttribute('decrease') == 'true') {
					updated_like--;
				}
				else {
					updated_like++;
				}
				console.log(i)
				fetch('/add', {
					method: "POST",
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						'index': i-1,
						'like': updated_like,
					})
				})
				.then(response => response.text())
				.then(html => console.log(html))
				.then(check())
			}))
		})

		function check () {
			fetch('/info').then(response=>response.json()).then(xdata=>{
				data = xdata.data; 
				data.forEach(d=>{
					d.title = d.Title
					d.runtime = parseInt(d.Running_time)
					d.budget = parseInt(d.Budget) 
					d.boxoffice = parseInt(d.Box_office) 
					d.like = d.Like 
				})
				
				update(data, 'title', 'like')
			})
		}
	})
})
