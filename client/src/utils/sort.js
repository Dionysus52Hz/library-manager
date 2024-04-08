export const sortAscending = (array, condition) => {
   return array.sort((a, b) => {
      return (a[condition] || '')
         .toString()
         .localeCompare((b[condition] || '').toString(), 'vi', {
            sensitivity: 'base',
         });
   });
};

export const sortDescending = (array, condition) => {
   return array.sort((a, b) => {
      return (b[condition] || '')
         .toString()
         .localeCompare((a[condition] || '').toString(), 'vi', {
            sensitivity: 'base',
         });
   });
};
