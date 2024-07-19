import { isProxy } from 'vue';
import type { Chart, ChartData, ChartDataset, ChartOptions, ChartType, DefaultDataPoint } from 'chart.js';

export function cloneProxy<T extends object>(obj: T, src = obj) {
  return isProxy(src) ? new Proxy(obj, {}) : obj;
}

export function setOptions<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown
>(chart: Chart<TType, TData, TLabel>, nextOptions: ChartOptions<TType>) {
  const { options } = chart;

  if (options && nextOptions) {
    Object.assign(options, nextOptions);
  }
}

export function setDatasets<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown
>(
  currentData: ChartData<TType, TData, TLabel>,
  nextDatasets: ChartDataset<TType, TData>[],
  datasetIdKey: string
) {
  const addedDatasets: ChartDataset<TType, TData>[] = [];

  currentData.datasets = nextDatasets.map(
    (nextDataset: Record<string, unknown>) => {
      // given the new set, find it's current match
      const currentDataset = currentData.datasets.find(
        (dataset: Record<string, unknown>) =>
          dataset[datasetIdKey] === nextDataset[datasetIdKey]
      );

      // There is no original to update, so simply add new one
      if (
        !currentDataset
        || !nextDataset.data
        || addedDatasets.includes(currentDataset)
      ) {
        return { ...nextDataset } as ChartDataset<TType, TData>;
      }

      addedDatasets.push(currentDataset);

      Object.assign(currentDataset, nextDataset);

      return currentDataset;
    }
  );
}

export function setLabels<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown
>(
  currentData: ChartData<TType, TData, TLabel>,
  nextLabels: TLabel[] | undefined
) {
  currentData.labels = nextLabels;
}

export function cloneData<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown
>(data: ChartData<TType, TData, TLabel>, datasetIdKey: string) {
  const nextData: ChartData<TType, TData, TLabel> = {
    labels: [],
    datasets: []
  };

  if (data?.labels)
    setLabels(nextData, data.labels);
  if (data?.datasets)
    setDatasets(nextData, data.datasets, datasetIdKey);

  return nextData;
}
