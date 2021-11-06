import React, { useEffect, useRef, useState } from "react";
import * as ReactDom from "react-dom";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import api from "../src/services/api";

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
  const [nome_ambiente, setNomeAmbiente] = useState("");
  const [descricao_medicao, setDescricaoMedicao] = useState("");
  const [periodoInicio, setPeriodoInicio] = useState("");
  const [periodoFim, setPeriodoFim] = useState("");
  const [presetMax, setPresetMax] = useState(0);
  const [presetMin, setPresetMin] = useState(0);
  const [serie_A, setSerie_A] = useState<number[]>([]);
  const [serie_B, setSerie_B] = useState<number[]>([]);
  const [serie_C, setSerie_C] = useState<number[]>([]);
  const [datas, setDatas] = useState<string[]>([]);

  useEffect(() => {
    api
      .post<IPropsChartHistory>(`/dataHistory/5/229`)
      .then((response) => {
        const { data } = response;
        if (response.status === 200) {
          console.log(data);
          setNomeAmbiente(data.nome_ambiente);
          setSerie_A(data.serie_A);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const options: Highcharts.Options = {
    title: {
      text: nome_ambiente,
    },
    series: [{ type: "line", data: serie_A }],
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
