export interface ButikoManifest {
  namespace: string;
  imports: string[];
  variables: ({
    name: string;
    value: string | number | Record<string, unknown>;
  } | {
    path: string;
  })[];
}

export type VariablesMap = Map<
  string,
  string | number | Record<string, unknown>
>;
