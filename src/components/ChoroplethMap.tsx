import * as d3 from 'd3';
import { useEffect } from 'react';
import * as topojson from 'topojson';
import './ChoroplethMap.css';
import { colors } from '../utils/helper';

const ChoroplethMap = () => {
  const width = 1000;
  const height = 600;

  useEffect(() => {
    async function drawMap() {
      // const tooltip = d3.select("#tooltip").attr("opacity", 0).style("visibility", "hidden");
      const tooltip = d3.select("body")
        .append('div')
        .attr('class', 'tooltip')
        .attr('id', 'tooltip')
        .style('opacity', 0);
      const educationData = await d3.json(
        'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
      );
      const countyData = await d3.json(
        'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
      );
      console.log('educationData:', educationData);
      console.log('countyData:', countyData);
      const counties = topojson.feature(
        countyData,
        countyData.objects.counties
      ).features;
      console.log('counties:', counties);

      const svg = d3.select('#map').attr('width', width).attr('height', height);

      d3.select('#title').text('United States Educational Attainment');
      d3.select('#description').text(
        "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
      );
      d3.select('#footer').html(
        `Source: <a href="https://www.ers.usda.gov/data-products/county-level-data-sets/download-data.aspx">USDA Economic Research Service</a>`
      );

      console.log(d3);
      console.log(topojson);

      // data
      svg
        .selectAll('path')
        .data(counties)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr('fill', (d) => {
          const percent = educationData.find(
            (element) => element.fips === d.id
          )?.['bachelorsOrHigher'];

          if (percent <= 15) {
            return colors[0];
          } else if (percent <= 30) {
            return colors[1];
          } else if (percent <= 45) {
            return colors[2];
          } else {
            return colors[3];
          }
        })
        .attr('data-fips', (d) => d.id)
        .attr('data-education', (d) => {
          return educationData.find((element) => element.fips === d.id)?.[
            'bachelorsOrHigher'
          ];
        })
        .on('mouseover', (e, d) => {
          tooltip.style('opacity', 0.9);
          const county = educationData.find((element) => element.fips === d.id);
          tooltip.text(
            county['area_name'] +
              ', ' +
              county['state'] +
              ' : ' +
              county['bachelorsOrHigher'] +
              '%'
          );
          tooltip
          .style('left', e.pageX + 'px')
          .style('top', e.pageY - 30 + 'px')
          .attr("data-education", county['bachelorsOrHigher'])
        })
        .on('mouseout', (e, d) => {
          tooltip.style('opacity', 0);
        });

      // legend
      const legend = d3
        .select('#legend')
        .attr('transform', 'rotate(-90)')
        .attr('x', 10)
        .attr('width', 100)
        .attr('height', 200)
        .selectAll('g')
        .data(colors)
        .enter()
        .append('g');
      // .attr("y", 200);

      legend
        .append('rect')
        .attr('class', 'legend-rect')
        .attr('width', 40)
        .attr('height', 40)
        .attr('x', 10)
        .attr('y', (d, i) => 20 + i * 40)
        .attr('fill', (d) => d);

      const legendLabels = ['0%', '15%', '30%', '45%', '100%'];
      legend
        .append('text')
        .attr('x', (_, i) => 20 + i * 40)
        .attr('y', -55)
        .text((_, i) => legendLabels[i])
        .attr('transform', 'rotate(90)')
        .style('font-size', '12px');
    }
    drawMap();
  });
  return (
    <>
      <h1 id="title"></h1>
      <h3 id="description"></h3>
      <div id="map-container">
        {/* <div id="tooltip">tooltip</div> */}
        <svg id="map"></svg>
        <div className="map-footer">
          <svg id="legend"></svg>
          <h3 id="footer"></h3>
        </div>
      </div>
    </>
  );
};

export default ChoroplethMap;
