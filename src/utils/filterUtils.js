export const convertFiltersToMongoDBQuery = (filters) => {
  const query = {};

  filters.forEach(filter => {
    const { attribute, operator, value } = filter;
    switch (operator) {
      case 'equals':
        query[attribute] = value;
        break;
      case 'notEquals':
        query[attribute] = { $ne: value };
        break;
      case 'greaterThan':
        query[attribute] = { $gt: value };
        break;
      case 'lessThan':
        query[attribute] = { $lt: value };
        break;
      case 'greaterThanOrEqual':
        query[attribute] = { $gte: value };
        break;
      case 'lessThanOrEqual':
        query[attribute] = { $lte: value };
        break;
      case 'in':
        query[attribute] = { $in: value };
        break;
      case 'notIn':
        query[attribute] = { $nin: value };
        break;
      default:
        break;
    }
  });

  return query;
};

export const validateFilter = (filter) => {
  const { attribute, operator, value } = filter;
  if (!attribute || !operator) {
    return false;
  }
  
  return true;
};