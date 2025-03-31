export class ObjectHelper {
  setToObject(
    path: string,
    value: string | number,
    object: Record<string, any>
  ): Record<string, any> {
    const regex = new RegExp("[.*=.*]");
    let splitedSelector = path.split(".");
    if (splitedSelector.length > 1) {
      let workingObject = object;

      splitedSelector.forEach((selectorItem, index) => {
        let isLastItem = index === splitedSelector.length - 1;

        if (regex.test(selectorItem) && !isLastItem) {
          if (Array.isArray(value)) {
            value = value
              .map((item: { id: string | number }) => item.id)
              .join(",");
          }
        } else if (
          !isLastItem &&
          (!workingObject.hasOwnProperty(selectorItem) ||
            workingObject[selectorItem] === null)
        ) {
          if (regex.test(splitedSelector[index + 1])) {
            workingObject[selectorItem] = [];
          } else {
            workingObject[selectorItem] = {};
          }
        }

        if (isLastItem) {
          if (regex.test(splitedSelector[index - 1])) {
            const splitedQuery = splitedSelector[index - 1]
              .replace(/\[|\]/g, "")
              .split("=");
            const queryKey = splitedQuery[0];
            const queryValue = splitedQuery[1];
            (workingObject as any[]).push({
              [queryKey]: queryValue,
              [selectorItem]: value,
            });
          } else {
            workingObject[selectorItem] = value;
          }
        }

        if (!regex.test(selectorItem)) {
          workingObject = workingObject[selectorItem];
        }
      });

      return object;
    }

    object[path] = value;
    return object;
  }

  select(path: string, object: Record<string, any>): any | null {
    let splitedSelector = path.split(".");
    if (splitedSelector.length > 1) {
      let selectingObject: Record<string, any> | null = { ...object };
      let notExists = false;

      splitedSelector.forEach((selectorItem) => {
        const regex = new RegExp("[.*=.*]");
        if (selectingObject && selectingObject.hasOwnProperty(selectorItem)) {
          selectingObject = selectingObject[selectorItem];
        } else if (regex.test(selectorItem)) {
          const splitedQuery = selectorItem.replace(/\[|\]/g, "").split("=");
          const queryKey = splitedQuery[0];
          const queryValue = splitedQuery[1];

          if (Array.isArray(selectingObject)) {
            selectingObject =
              selectingObject.find((item) => item[queryKey] === queryValue) ||
              null;
          }
        } else notExists = true;
      });

      if (notExists) return null;
      return selectingObject;
    }

    return object.hasOwnProperty(splitedSelector[0])
      ? object[splitedSelector[0]]
      : null;
  }
}

export function generateUniqueString() {
  let length = 6,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}
export function extractIds(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (Array.isArray(value)) {
        // Convert array of string numbers to number array, otherwise keep original values
        result[key] = value.every(
          (item) => typeof item === "string" && !isNaN(Number(item))
        )
          ? value.map(Number) // Convert all string numbers to actual numbers
          : value; // Keep the array unchanged if it contains objects or mixed types
      } else if (typeof value === "object" && value !== null && "id" in value) {
        // Replace the nested object with its `id` value
        result[key] = value.id;
      } else if (typeof value === "object" && value !== null) {
        // Recursively process nested objects
        result[key] = extractIds(value);
      } else {
        // Preserve other properties
        result[key] = value;
      }
    }
  }

  return result;
}

export const isCurrentTimeBetween = (start: string, end: string) => {
  const now = new Date();
  const currentTime =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds(); // Convert current time to seconds

  const [startHour, startMinute, startSecond] = start.split(":").map(Number);
  const [endHour, endMinute, endSecond] = end.split(":").map(Number);

  const startTime = startHour * 3600 + startMinute * 60 + startSecond; // Convert startClock to seconds
  const endTime = endHour * 3600 + endMinute * 60 + endSecond; // Convert endClock to seconds

  return currentTime >= startTime && currentTime <= endTime;
};
