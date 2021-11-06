import React, { useEffect, useRef, useState } from "react";
import * as ReactDom from "react-dom";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import api from "../src/services/api";
// The wrapper exports only a default component that at the same time is a
// namespace for the related Props interface (HighchartsReact.Props) and
// RefObject interface (HighchartsReact.RefObject). All other interfaces
// like Options come from the Highcharts module itself.

// React supports function components as a simple way to write components that
// only contain a render method without any state (the App component in this
// example).

interface IPropsChartHistory {
  nome_ambiente: string;
  descricao_medicao: string;
  periodoFim: string;
  periodoInicio: string;
  presetMax: number;
  presetMin: number;
  serie_A: number[];
  serie_B: number[];
  serie_C: number[];
  datas: string[];
}

export const App = (props: HighchartsReact.Props) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [dataHistory, setDataHistory] = useState({} as IPropsChartHistory);
  useEffect(() => {
    api
      .post(`/dataHistory/5/229`)
      .then((response) => {
        setDataHistory(response.data);
        console.log(response.data.dataHistory.serie_A);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const options: Highcharts.Options = {
    title: {
      text: "My chart",
    },
    series: [{ type: "area", data: dataHistory?.serie_A }],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartComponentRef}
      {...props}
    ></HighchartsReact>
  );
};
// Render your App component into the #root element of the document.
ReactDom.render(<App />, document.getElementById("root"));
