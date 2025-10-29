export const cleanReturned = (
  object: any,
  fieldsToReturn: string[] = [],
): any => {
  const fieldsToClean = [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'password',
  ];

  const cleanObject = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(item => cleanObject(item));
    }

    if (typeof obj === 'object' && obj !== null) {
      return Object.keys(obj).reduce((acc, key) => {
        if (fieldsToClean.includes(key) && !fieldsToReturn.includes(key)) {
          return acc;
        }

        acc[key] =
          typeof obj[key] === 'object' && obj[key] !== null
            ? cleanObject(obj[key])
            : obj[key];

        return acc;
      }, {});
    }

    return obj;
  };

  return cleanObject(object);
};
