import * as d3 from 'd3';
import * as React from 'react';

type DataItem = {
  name: string;
  value: number;
  color: string;
};
type DonutChartProps = {
  width: number;
  height: number;
  data: DataItem[];
  hole?: React.ReactNode;
};

export const DonutChart = ({ width, height, data, hole }: DonutChartProps) => {
  const radius = Math.min(width, height) / 2;

  const pie = React.useMemo(() => {
    const pieGenerator = d3.pie<unknown, DataItem>().value((d) => d.value);
    return pieGenerator(data);
  }, [data]);

  const arcs = React.useMemo(() => {
    const arcPathGenerator = d3.arc();
    return pie.map((p) =>
      arcPathGenerator({
        innerRadius: 0.67 * radius,
        outerRadius: radius,
        startAngle: p.startAngle,
        endAngle: p.endAngle,
      }),
    );
  }, [radius, pie]);

  return (
    <div className="relative w-fit">
      <svg width={width} height={height} style={{ display: 'inline-block' }}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {arcs.map((arc, i) => {
            if (arc) {
              return <path key={i} d={arc} fill={data[i]?.color} />;
            }
          })}
        </g>
      </svg>
      <div
        className="absolute inset-0 m-auto rounded-full bg-white opacity-25"
        style={{ width: 1.6 * radius, height: 1.6 * radius }}
      ></div>
      <div
        className="absolute inset-0 m-auto flex flex-col items-center justify-center overflow-hidden rounded-full"
        style={{ width: 1.6 * radius, height: 1.6 * radius }}
      >
        {hole}
      </div>
    </div>
  );
};
