import { ExperimentModule } from "~/components/modules/Experiment";

type Props = {
  value: any;
};

export function ExperimentBlock({ value }: Props) {
  return <ExperimentModule module={value} />;
}
