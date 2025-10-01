// utils/objectToFormData.ts

export function objectToFormData(
  obj: Record<string, any>,
  form: FormData = new FormData(),
  namespace: string = ""
): FormData {
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const formKey = namespace ? `${namespace}[${key}]` : key;
    const value = obj[key];

    if (value === undefined || value === null) continue;

    if (value instanceof File) {
      form.append(formKey, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File) {
          form.append(formKey, item);
        } else if (item?.originFileObj instanceof File) {
          form.append(formKey, item.originFileObj);
        } else {
          form.append(formKey, String(item));
        }
      });
    } else if (typeof value === "object" && !(value instanceof Date)) {
      objectToFormData(value, form, formKey);
    } else {
      form.append(formKey, String(value));
    }
  }

  return form;
}
