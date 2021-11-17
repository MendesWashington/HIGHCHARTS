import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import api from "./services/api";

interface DataHistory {
  dataHistory: {
    nome_ambiente: string;
    descricao_medicao: string;
    tipo: number;
    periodoInicio: string;
    periodoFim: string;
    presetMax: number;
    presetMin: number;
    maximoHistorico: number;
    minimoHistorico: number;
    serie_A: number[];
    serie_B: number[];
    serie_C: number[];
    datasEpoch: string[];
  };
}

export const App = (props: HighchartsReact.Props) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [dataApi, setDataApi] = useState<DataHistory>({} as DataHistory);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .post<DataHistory>(`/dataHistory/5/229`)
      .then((response) => {
        setDataApi(response.data);
        console.log(response.data);

        setLoading(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const options: Highcharts.Options = {
    title: {
      text: dataApi.dataHistory?.nome_ambiente,
    },
    credits: {
      enabled: true,
      text: "appsupply",
      href: "https://painel.appsupply.ml/",
    },
    subtitle: {
      text: dataApi.dataHistory?.descricao_medicao,
    },
    rangeSelector: {
      buttons: [
        {
          type: "hour",
          count: 24,
          text: "24h",
        },
        {
          type: "day",
          count: 30,
          text: "30d",
        },
        {
          type: "day",
          count: 60,
          text: "60d",
        },

        {
          type: "all",
          text: "All",
        },
      ],
      selected: 3,
    },
    series: [
      {
        name: "Temperatura (°C)",
        type: "line",
        data: dataApi.dataHistory?.serie_A,
        tooltip: {
          valueDecimals: 1,
          valueSuffix: "°C",
        },
      },
    ],
    legend: {
      enabled: true,
    },
    yAxis: {
      title: {
        text: "Temperature (°C)",
        align: "low",
      },
      opposite: false,
      max: dataApi.dataHistory?.maximoHistorico,
      min: dataApi.dataHistory?.minimoHistorico,

      plotLines: [
        {
          value: dataApi.dataHistory?.presetMax,
          color: "red",
          dashStyle: "ShortDash",
          width: 2,
          label: {
            text: "Máx",
          },
        },
        {
          value: dataApi.dataHistory?.presetMin,
          color: "yellow",
          dashStyle: "ShortDash",
          width: 2,
          label: {
            text: "Min",
          },
        },
      ],
    },
  };
  return loading ? (
    <>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
        ref={chartComponentRef}
        {...props}
      ></HighchartsReact>
    </>
  ) : (
    <h1>Loading...</h1>
  );
};
