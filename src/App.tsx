import React, { useEffect, useRef, useState } from "react";
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

interface DataHistory {
  dataHistory: {
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
    datasEpoch: string[];
  };
}

export const App = (props: HighchartsReact.Props) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [dataApi, setDataApi] = useState<DataHistory>({} as DataHistory);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function DataApi() {
      try {
        const { data, status } = await api.post<DataHistory>(
          `/dataHistory/5/229`,
          {}
        );
        if (status === 200) {
          setDataApi(data);
          console.log(data);
          setLoading(true);
        }
      } catch (error) {
        throw new Error("Erro na busca de dados");
      }
    }

    DataApi();
    /*  api
      .post<DataHistory>(`/dataHistory/5/229`)
      .then((response) => {
        setDataHistory(response.data);
        console.log(response.data);
        console.log(response.data.serie_A);
        setLoading(true);
      })
      .catch((error) => {
        console.log(error);
      }); */
  }, []);

  const options: Highcharts.Options = {
    title: {
      text: dataApi.dataHistory?.nome_ambiente,
    },
    series: [
      {
        type: "line",
        data: dataApi.dataHistory?.serie_A,
      },
    ],
  };
  return loading ? (
    <>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
        {...props}
      ></HighchartsReact>
    </>
  ) : (
    <h1>Loading...</h1>
  );
};
