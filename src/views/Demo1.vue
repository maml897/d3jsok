<template>
  <div id="app">
    <div id="preview"></div>
    <div id="view"></div>
    <div>{{ datas }}</div>
  </div>
</template>

<script>
import * as d3 from 'd3';
export default {
  name: 'App',
  data() {
    return {
      datas: [],
      dom: null,
      svg: null,
    };
  },
  mounted() {
    var l = d3.create('svg').attr('width', 550).attr('height', 550);
    l.append('path')
      .attr(
        'd',
        'M 143 153 L 144 153 L 151 156 L 158 161 L 172 175 L 178 184 L 186 202 L 187 209 L 187 215 L 187 220 L 182 226 L 177 230 L 167 235 L 152 240 L 137 241 L 127 241 L 120 241 L 117 241 L 115 238 L 114 227 L 114 212 L 114 196 L 114 180 L 118 167 L 123 162 L 126 159 L 131 158 L 140 158 L 152 158 L 160 158 L 172 164 L 176 167 L 178 169'
      )
      .attr('stroke', 'red')
      .attr('stroke-width', '5')
      .attr('fill', 'none')
      .property('Symbol', Symbol());

    let data = encodeURIComponent(
      `<svg viewBox="0 0 300 300"  xmlns="http://www.w3.org/2000/svg" >${l.html()}</svg>`
    );
    data = `data:image/svg+xml;charset=utf-8,${data}`;

    d3.select('body').append('img').attr('src', data);

    // let info =
    //   'data:image/svg+xml;base64,' +
    //   window.btoa(unescape(encodeURIComponent(l)));

    // console.log(info);

    let img = d3.select('#preview').append('img');
    function image(svg) {
      let src = encodeURIComponent(
        `<svg viewBox="0 0 1024 1024" width="300" height="300"  xmlns="http://www.w3.org/2000/svg" >${svg.html()}</svg>`
      );
      src = `data:image/svg+xml;charset=utf-8,${src}`;
      img.attr('src', src);
    }

    let $this = this;
    let dom = d3.select('body');
    let svg = d3
      .select('#view')
      .append('svg')
      .attr('border', 1)
      .attr('width', 550)
      .attr('height', 550);

    $this.dom = dom;
    $this.svg = svg;

    // var draged = d3.drag().on('drag', function (d) {
    //   d.dx += d3.event.dx;
    //   d.dy += d3.event.dy;
    //   d3.select(this).attr('transform', 'translate(' + d.dx + ',' + d.dy + ')');
    // });

    $this.svg.on('mousedown', function (e) {
      var { offsetX, offsetY } = e;
      var arr = [];

      arr.push(`M ${offsetX} ${offsetY}`);
      let chart = $this.svg
        .append('path')
        .attr('d', arr.join(''))
        .attr('stroke', 'red')
        .attr('stroke-width', '5')
        .attr('fill', 'none')
        .property('Symbol', Symbol());

      $this.dom.on('mousemove', function (e) {
        chart.on('mouseover', null);
        var { offsetX, offsetY } = e;
        arr.push(`L ${offsetX} ${offsetY}`);
        chart.attr('d', arr.join(' '));
        image($this.svg);
      });

      $this.dom.on('mouseup', function () {
        $this.dom.on('mousemove', null);
        $this.dom.on('mouseup', null);

        if (arr.length < 2) {
          chart.remove();
          return;
        }
        $this.datas.push({
          Symbol: chart.property('Symbol'),
          data: arr,
        });

        let x = 0,
          y = 0;
        chart.call(
          d3
            .drag()
            .on('start', function (d) {
              d3.select(this).classed('dragging', true);
              console.log('start');
            })
            .on('end', function (d) {
              d3.select(this).classed('dragging', false);
              console.log('end');
            })
            .on('drag', function (d) {
              console.log(d.dx, '==', chart.attr('transform'));
              x = x + d.dx;
              y = y + d.dy;
              d3.select(this).attr(
                'transform',
                'translate(' + x + ',' + y + ')'
              );
            })
        );

        //拖拽
        // chart.on('mousedown', function (e) {
        //   e.preventDefault();
        //   e.stopPropagation();
        //   var { offsetX, offsetY } = e;
        //   console.log('good');
        //   $this.dom.on('mousemove', function (e) {
        //     console.log('aaaaaaaaaaaaaa');
        //     e.preventDefault();
        //     e.stopPropagation();
        //     let dx = e.offsetX - offsetX;
        //     let dy = e.offsetY - offsetY;
        //     chart.attr('transform', 'translate(' + dx + ',' + dy + ')');

        //     $this.dom.on('mouseup', function () {
        //       //chart.attr('transform', 'translate(' + 0 + ',' + 0 + ')').

        //       $this.dom.on('mousemove', null);
        //       $this.dom.on('mouseup', null);
        //     });
        //   });
        // });

        chart
          .on('click', function () {
            let a = chart.property('Symbol');
            let aa = $this.datas.findIndex(function (value, index, arr) {
              return value.Symbol == a;
            });
            $this.datas.splice(aa, 1);
            chart.remove();
            image($this.svg);
          })
          .on('mouseover', function () {
            chart.attr('stroke', 'blue');
            image($this.svg);
          })
          .on('mouseout', function () {
            chart.attr('stroke', 'red');
            image($this.svg);
          });
      });
    });
  },
};
</script>
