
export const assetsTypes = [
    'acquisitions',
    'courtOrders',
    'employees',
    'licenseIn',
    'licenseOut',
    'mergersIn',
    'mergersOut',
    'options',
    'sales',
    'securities',
   /*  'lending',
    'borrowing',
    'releaseOut',
    'releaseIn', */
    'correct',
    'other',
    'ownership'
  ]

export const assetsTypesWithKey = [
  {type: 'acquisitions', name: 'Acquisitions', counter: 0},
  {type: 'courtOrders', name: 'Court Orders', counter: 0},
  {type: 'employees', name: 'Employees', counter: 0},
  {type: 'licenseIn', name: 'License In', counter: 0},
  {type: 'licenseOut', name: 'License Out', counter: 0},
  {type: 'mergersIn', name: 'Merger In', counter: 0},
  {type: 'mergersOut', name: 'Merger Out', counter: 0},
  {type: 'options', name: 'Options', counter: 0},
  {type: 'sales', name: 'Sales', counter: 0},
  {type: 'securities', name: 'Securities', counter: 0},
  /* {type: 'partialRelease', name: 'Partial Release', counter: 0},
  {type: 'lending', name: 'Lending', counter: 0},
  {type: 'borrowing', name: 'Borrowing', counter: 0},
  {type: 'releaseOut', name: 'Release Out', counter: 0},
  {type: 'releaseIn', name: 'Release In', counter: 0}, */
  {type: 'correct', name: 'Correction', counter: 0},
  {type: 'other', name: 'Other', counter: 0},
  {type: 'ownership', name: 'Ownership', counter: 0}
]
  
  export const defaultAssetsCountByTypeCounter = assetsTypes.reduce((result, assetType) => {
    result[assetType] = 0
    return result
   }, {})

  export const oldConvertTabIdToAssetType = (tabId) => {
    switch(parseInt(tabId)){
      case 0:
        return 'acquisitions'
      case 1:
        return 'sales'
      case 2:
        return 'licenseIn'
      case 3:
        return 'licenseOut'
      case 4:
        return 'securitiesOut'
      case 5:
        return 'mergersIn'
      case 6:
          return 'mergersOut'
      case 7:
        return 'options'
      case 8:
        return 'courtOrders'
      case 9:
        return 'employees'
      case 11:
        return 'releaseOut'
      case 12:
        return 'securitiesIn'
      case 13:
        return 'releaseIn'
      case 15:
        return 'correct'
      case 16:
        return 'partialRelease'
      case 17:
        return 'ownership'
      case 10:
      default:
        return 'other'
    }
  }
  
  export const convertTabIdToAssetType = (tabId) => {
    switch(parseInt(tabId)){
      case 1:
        return 'acquisitions'
      case 2:
        return 'sales'
      case 3:
        return 'licenseIn'
      case 4:
        return 'licenseOut'
      case 5:
        return 'lending'
      case 6:
        return 'mergersIn'
      case 7:
        return 'mergersOut'
      case 8:
        return 'options'
      case 9:
        return 'courtOrders'
      case 10:
        return 'employees'
      case 11:
        return 'releaseOut'
      case 12:
        return 'borrowing'
      case 13:
        return 'releaseIn'
      case 15:
        return 'correct'
      case 16:
        return 'partialRelease'
      case 17:
        return 'ownership'
      case 81:
        return 'securities'
      case 14:
      default:
        return 'other'
    }
  }
  
  export const convertAssetTypeToTabId = (assetType) => {
    switch(assetType){
      case 'acquisitions':
        return 1
      case 'sales':
        return 2
      case 'licenseIn':
        return 3
      case 'licenseOut':
        return 4
      case 'lending':
        return 5
      case 'mergersIn':
        return 6
      case 'mergersOut':
        return 7
      case 'options':
        return 8
      case 'courtOrders':
        return 9
      case 'employees':
        return 10
      case 'releaseOut':
        return 11
      case 'borrowing':
        return 12
      case 'releaseIn':
        return 13
      case 'correct':
        return 15
      case 'partialRelease':
        return 16
      case 'ownership':
        return 17
      case 'securities':
        return 81
      case 'other':
      default:
        return 14
    }
  }

export const otherGroup = () => {
  return [8,9,14]
}

export const financingGroup = () => {
  return [5,11,12,13]
}

export const licensingGroups = () => {
  return [3,4]
}

export const ownershipGroups = () => {
  return [1,2,6,7]
}

export const employeesGroups = () => {
  return [10]
}

export const exportGroups = () => {
  // Groups timeline
  return [ 
    {id: 4, name: 'Ownership', className: 'group-ownership', list: ownershipGroups()}, 
    {id: 3, name: 'Licensing', className: 'group-licensing', list: licensingGroups()}, 
    {id: 2, name: 'Financing', className: 'group-financing', list: financingGroup()}, 
    {id: 5, name: 'Employees', className: 'group-employees', list: employeesGroups()},
    {id: 1, name: 'Other', className: 'group-others', list: otherGroup()}
  ]
}