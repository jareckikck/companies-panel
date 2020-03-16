import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { CacheKeys } from 'src/app/models/cache-keys';

@Component({
	selector: 'app-chart',
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
	@ViewChild('chart', { static: true }) private chartContainer: ElementRef;

	@Input() data
	private margin: any = { top: 50, bottom: 50, left: 50, right: 50 };
	private chart: any;
	private width: number;
	private height: number;
	private xScale: any;
	private yScale: any;
	private colors: any;
	private xAxis: any;
	private yAxis: any;
	private tooltip: any;

	constructor() { }

	ngOnInit() {
		this.createChart();
		if (this.data) {
			localStorage[CacheKeys.CHART_DATA] = JSON.stringify(this.data);
			this.updateChart();
		}
	}

	ngOnChanges() {
		if (localStorage.getItem(CacheKeys.CHART_DATA) !== JSON.stringify(this.data)) {
			localStorage[CacheKeys.CHART_DATA] = JSON.stringify(this.data);
			this.updateChart();
		}
	}

	createChart() {
		// const tooltipBody = '<div><div class="1"></div><div class="2"> </div></div>'
		this.tooltip = d3.select('body').append("div")
			.classed('chart-tooltip', true)
			.style('display', 'none');

		this.tooltip.append("div")
			.classed('tooltip-val', true)
		this.tooltip.append("div")
			.classed('tooltip-date', true)


		let element = this.chartContainer.nativeElement;
		this.width = element.offsetWidth - this.margin.left - this.margin.right;
		this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
		let svg = d3.select(element).append('svg')
			.attr('width', element.offsetWidth)
			.attr('height', element.offsetHeight);

		// chart plot area
		this.chart = svg.append('g')
			.attr('class', 'bars')
			.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

		// define X & Y domains
		let xDomain = this.data.map(d => d[0]);
		let yDomain = [0, d3.max(this.data, d => d[1])];

		// create scales
		this.xScale = d3.scaleBand().padding(0.1).domain(xDomain).rangeRound([0, this.width]);
		this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);

		// bar colors
		this.colors = d3.scaleLinear().domain([0, this.data.length]).range(<any[]>['blue', 'blue']);

		// x & y axis
		this.xAxis = svg.append('g')
			.attr('class', 'axis axis-x')
			.attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
			.call(d3.axisBottom(this.xScale));
		this.yAxis = svg.append('g')
			.attr('class', 'axis axis-y')
			.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
			.call(d3.axisLeft(this.yScale));
	}

	updateChart() {
		// update scales & axis
		this.xScale.domain(this.data.map(d => d[0]));
		this.yScale.domain([0, d3.max(this.data, d => d[1])]);
		this.colors.domain([0, this.data.length]);
		this.xAxis.transition().call(d3.axisBottom(this.xScale));
		this.yAxis.transition().call(d3.axisLeft(this.yScale));

		let update = this.chart.selectAll('.bar')
			.data(this.data);

		// remove exiting bars
		update.exit().remove();

		// update existing bars
		this.chart.selectAll('.bar').transition()
			.attr('x', d => this.xScale(d[0]))
			.attr('y', d => this.yScale(d[1]))
			.attr('width', d => this.xScale.bandwidth())
			.attr('height', d => this.height - this.yScale(d[1]))
			.style('fill', (d, i) => this.colors(i));

		// add new bars
		update
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('x', d => this.xScale(d[0]))
			.attr('y', d => this.yScale(0))
			.attr('width', this.xScale.bandwidth())
			.attr('height', 0)
			.style('fill', (d, i) => this.colors(i))
			.transition()
			.delay((d, i) => i * 10)
			.attr('y', d => this.yScale(d[1]))
			.attr('height', d => this.height - this.yScale(d[1]))

		console.log('add mouseover ')

		this.chart.selectAll('.bar')
			.on("mouseover", () => {
				this.tooltip.style("display", null)
			})
			.on("mouseout", () => {
				this.tooltip.style("display", "none")
			})
			.on("mousemove", (d: any) => {
				this.tooltip
					.style("left", d3.event.pageX + 15 + "px")
					.style("top", d3.event.pageY - 25 + "px")
				d3.select('.tooltip-val').text('Value: ' + d[1])
				d3.select('.tooltip-date').text('Date: ' + d[0])
			});
	}

}
