import { ObjectHelper } from "../../helpers/objects";

type State = { [key: string]: any };
interface SetDataPayload {
  path: string;
  value: any;
  values?: { path: string; value: any }[];
}

interface SetDataItem {
  path: string;
  value: any;
}

interface PushDataPayload {
  path: string;
  value: any;
  merge?: boolean;
  unique?: string;
}

export default function setDataReducer(
  state: State,
  { payload }: { payload: SetDataPayload }
): State {
  const objectHelper = new ObjectHelper();
  if (payload.values) {
    payload.values.forEach((item: SetDataItem) => {
      state = objectHelper.setToObject(item.path, item.value, state);
    });
    return state;
  }
  return objectHelper.setToObject(payload.path, payload.value, state);
}
export function pushDataReducer(
  state: State,
  { payload }: { payload: PushDataPayload }
): State {
  const objectHelper = new ObjectHelper();

  // select item form state
  let object = objectHelper.select(payload.path, state);

  if (object === null) object = [];

  // push item
  if (object && Array.isArray(object)) {
    if (payload.merge) object = [...object, ...payload.value];
    else object.push(payload.value);

    if (payload.unique) {
      object = object.filter(
        (objectItem: any, index: number, self: []) =>
          self.findIndex(
            (item) =>
              item[payload.unique as string] ===
              objectItem[payload.unique as string]
          ) === index
      );
    }
  }

  return objectHelper.setToObject(payload.path, object, state);
}
