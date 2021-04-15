const tooltip = document.getElementById('tooltip');
const moviesURL =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';
let movieData; //to store imported movie data
let createChart = () => {
  const w = 1000;
  const h = 600;
  //pull and sort value data from the node list
  let hierarchy = d3
    .hierarchy(movieData, (node) => {
      return node['children'];
    })
    .sum((node) => {
      return node['value']; //defines how to adjust tile size to the value size
    })
    .sort((node1, node2) => {
      return node2['value'] - node1['value']; //return bigger values first, over smaller
    });

  //create map size
  let createTreeMap = d3.treemap().size([w, h]);

  createTreeMap(hierarchy); //sets coordinates on properties of each leaf node

  //append received data/coordinates to the svg
  const svg = d3
    .select('#canvas')
    .selectAll('g')
    .data(hierarchy.leaves())
    .enter()
    .append('g')
    .attr('transform', (i) => {
      return 'translate(' + i['x0'] + ', ' + i['y0'] + ')'; //assigning received coordinates from createTreeMap function to the attributes of each element
    });

  svg
    .append('rect')
    .attr('class', 'tile')
    //setting fcc required attributes
    .attr('data-name', (i) => {
      return i['data']['name'];
    })
    .attr('data-category', (i) => {
      return i['data']['category'];
    })
    .attr('data-value', (i) => {
      return i['data']['value'];
    }) // tile size;
    .attr('width', (i) => {
      return i['x1'] - i['x0'];
    })
    .attr('height', (i) => {
      return i['y1'] - i['y0'];
    })
    //colors
    .attr('fill', (i) => {
      var category = i['data']['category']; //indicate category field, to sort by categories/genres
      switch (category) {
        case 'Action':
          return '#e41c38';
          break;
        case 'Adventure':
          return '#87A96B';
          break;
        case 'Animation':
          return 'lightblue';
          break;
        case 'Biography':
          return 'blue';
          break;
        case 'Comedy':
          return 'orange';
          break;
        case 'Drama':
          return 'grey';
          break;
        case 'Family':
          return 'yellow';
          break;
        default:
          return;
      }
    })
    .on('mouseover', (x, i) => {
      let money = i['data']['value']
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      let name = i['data']['name'];
      tooltip.setAttribute('data-value', money);
      tooltip.innerHTML = `
      <p>
      <b>$${money}</b><br />
      <b>Name: ${name}</b><br />
    </p>`;
    })
    .on('mouseout', () => {
      tooltip.innerHTML = `
      <p>
      <b>$ </b><br />
      <b>Name: </b><br />
    </p>`;
    });
  svg
    .append('text')
    .text((i) => {
      return i['data']['name'];
    })
    .attr('x', 10)
    .attr('y', 25);
};

d3.json(moviesURL).then((data) => {
  movieData = data; //passing imported data into the variable
  createChart();
});
